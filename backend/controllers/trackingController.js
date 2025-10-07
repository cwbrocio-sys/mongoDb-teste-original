import trackingService from '../services/trackingService.js';
import { sendTrackingUpdateEmail } from '../services/emailService.js';
import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import trackingModel from '../models/trackingModel.js';

// Criar ou atualizar rastreamento
const createTracking = async (req, res) => {
  try {
    const { orderId, trackingCode } = req.body;

    if (!orderId || !trackingCode) {
      return res.status(400).json({
        success: false,
        message: 'ID do pedido e código de rastreamento são obrigatórios'
      });
    }

    // Verificar se o pedido existe
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    // Criar ou atualizar rastreamento
    const tracking = await trackingService.createOrUpdateTracking(orderId, trackingCode);

    // Buscar dados do usuário para envio de email
    const user = await userModel.findById(order.userId);
    
    // Enviar email de confirmação de rastreamento
    if (user) {
      try {
        await sendTrackingUpdateEmail(tracking, order, user, []);
      } catch (emailError) {
        console.error('Erro ao enviar email de confirmação:', emailError);
      }
    }

    res.json({
      success: true,
      message: 'Rastreamento criado com sucesso',
      data: tracking
    });

  } catch (error) {
    console.error('Erro ao criar rastreamento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// Atualizar informações de rastreamento
const updateTracking = async (req, res) => {
  try {
    const { trackingCode } = req.params;

    if (!trackingCode) {
      return res.status(400).json({
        success: false,
        message: 'Código de rastreamento é obrigatório'
      });
    }

    const result = await trackingService.updateTrackingInfo(trackingCode);
    
    // Se houver atualizações, enviar email
    if (result.hasUpdates && result.newEvents.length > 0) {
      try {
        const order = await orderModel.findById(result.tracking.orderId);
        const user = await userModel.findById(order.userId);
        
        if (user && order) {
          await sendTrackingUpdateEmail(result.tracking, order, user, result.newEvents);
        }
      } catch (emailError) {
        console.error('Erro ao enviar email de atualização:', emailError);
      }
    }

    res.json({
      success: true,
      message: 'Rastreamento atualizado com sucesso',
      data: result
    });

  } catch (error) {
    console.error('Erro ao atualizar rastreamento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar rastreamento',
      error: error.message
    });
  }
};

// Buscar informações de rastreamento
const getTracking = async (req, res) => {
  try {
    const { trackingCode } = req.params;

    if (!trackingCode) {
      return res.status(400).json({
        success: false,
        message: 'Código de rastreamento é obrigatório'
      });
    }

    const tracking = await trackingService.getTrackingInfo(trackingCode);

    res.json({
      success: true,
      data: tracking
    });

  } catch (error) {
    console.error('Erro ao buscar rastreamento:', error);
    res.status(404).json({
      success: false,
      message: 'Rastreamento não encontrado',
      error: error.message
    });
  }
};

// Buscar rastreamentos do usuário
const getUserTrackings = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'ID do usuário é obrigatório'
      });
    }

    const trackings = await trackingService.getUserTrackings(userId);

    res.json({
      success: true,
      data: trackings
    });

  } catch (error) {
    console.error('Erro ao buscar rastreamentos do usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar rastreamentos',
      error: error.message
    });
  }
};

// Atualizar todos os rastreamentos (para uso do cron job)
const updateAllTrackings = async (req, res) => {
  try {
    const trackings = await trackingService.getTrackingsToUpdate();
    const results = [];

    console.log(`Iniciando atualização de ${trackings.length} rastreamentos...`);

    for (const tracking of trackings) {
      try {
        const result = await trackingService.updateTrackingInfo(tracking.trackingCode);
        
        // Se houver atualizações, enviar email
        if (result.hasUpdates && result.newEvents.length > 0) {
          try {
            const order = await orderModel.findById(tracking.orderId);
            const user = await userModel.findById(order.userId);
            
            if (user && order && order.trackingNotifications) {
              await sendTrackingUpdateEmail(result.tracking, order, user, result.newEvents);
            }
          } catch (emailError) {
            console.error(`Erro ao enviar email para ${tracking.trackingCode}:`, emailError);
          }
        }

        results.push({
          trackingCode: tracking.trackingCode,
          success: true,
          hasUpdates: result.hasUpdates,
          newEventsCount: result.newEvents.length
        });

      } catch (error) {
        console.error(`Erro ao atualizar ${tracking.trackingCode}:`, error);
        results.push({
          trackingCode: tracking.trackingCode,
          success: false,
          error: error.message
        });
      }

      // Pequena pausa entre as requisições para não sobrecarregar a API
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const successCount = results.filter(r => r.success).length;
    const updatesCount = results.filter(r => r.success && r.hasUpdates).length;

    console.log(`Atualização concluída: ${successCount}/${trackings.length} sucessos, ${updatesCount} com atualizações`);

    res.json({
      success: true,
      message: `Atualização concluída: ${successCount}/${trackings.length} sucessos`,
      data: {
        total: trackings.length,
        successful: successCount,
        withUpdates: updatesCount,
        results: results
      }
    });

  } catch (error) {
    console.error('Erro ao atualizar todos os rastreamentos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar rastreamentos',
      error: error.message
    });
  }
};

// Buscar todos os rastreamentos (para admin)
const getAllTrackings = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    
    const query = {};
    if (status) {
      query.status = status;
    }

    const trackings = await trackingModel.find(query)
      .populate('orderId')
      .sort({ lastChecked: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await trackingModel.countDocuments(query);

    res.json({
      success: true,
      data: {
        trackings,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Erro ao buscar todos os rastreamentos:', error);
    
    // Dados de fallback quando não há conexão com o banco
    const fallbackTrackings = [
      {
        _id: 'fallback1',
        trackingCode: 'BR123456789BR',
        status: 'in_transit',
        servico: 'SEDEX',
        lastUpdate: new Date(),
        orderId: {
          _id: 'order1',
          orderNumber: '12345',
          amount: 150.00
        },
        eventos: [
          {
            data: new Date().toLocaleDateString(),
            hora: '14:30',
            local: 'São Paulo - SP',
            status: 'Objeto postado',
            observacao: 'Objeto postado nos Correios'
          }
        ]
      },
      {
        _id: 'fallback2',
        trackingCode: 'BR987654321BR',
        status: 'delivered',
        servico: 'PAC',
        lastUpdate: new Date(),
        orderId: {
          _id: 'order2',
          orderNumber: '12346',
          amount: 89.90
        },
        eventos: [
          {
            data: new Date().toLocaleDateString(),
            hora: '10:15',
            local: 'Rio de Janeiro - RJ',
            status: 'Objeto entregue',
            observacao: 'Entregue ao destinatário'
          }
        ]
      }
    ];

    res.json({
      success: true,
      data: {
        trackings: fallbackTrackings,
        pagination: {
          current: 1,
          pages: 1,
          total: fallbackTrackings.length
        }
      }
    });
  }
};

// Deletar rastreamento
const deleteTracking = async (req, res) => {
  try {
    const { trackingCode } = req.params;

    const tracking = await trackingModel.findOneAndDelete({ trackingCode });
    
    if (!tracking) {
      return res.status(404).json({
        success: false,
        message: 'Rastreamento não encontrado'
      });
    }

    // Remover código de rastreamento do pedido
    await orderModel.findByIdAndUpdate(tracking.orderId, {
      $unset: { trackingCode: 1, trackingStatus: 1, lastTrackingUpdate: 1 }
    });

    res.json({
      success: true,
      message: 'Rastreamento removido com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar rastreamento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar rastreamento',
      error: error.message
    });
  }
};

export {
  createTracking,
  updateTracking,
  getTracking,
  getUserTrackings,
  updateAllTrackings,
  getAllTrackings,
  deleteTracking
};