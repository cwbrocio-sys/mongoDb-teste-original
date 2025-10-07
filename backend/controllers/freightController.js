import FreightRegion from '../models/freightRegionModel.js';
import CEPService from '../services/cepService.js';

// Calcular frete por CEP
const calculateFreightByCEP = async (req, res) => {
  try {
    const { cep, weight = 1, orderValue = 0 } = req.body;

    if (!cep) {
      return res.status(400).json({
        success: false,
        message: "CEP é obrigatório"
      });
    }

    const result = await CEPService.calculateFreight(cep, weight, orderValue);

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Erro ao calcular frete:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Consultar informações do CEP
const getCEPInfo = async (req, res) => {
  try {
    const { cep } = req.params;

    if (!cep) {
      return res.status(400).json({
        success: false,
        message: "CEP é obrigatório"
      });
    }

    const cepInfo = await CEPService.getCEPInfo(cep);

    res.json({
      success: true,
      data: cepInfo
    });

  } catch (error) {
    console.error('Erro ao consultar CEP:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Listar regiões de frete
const listFreightRegions = async (req, res) => {
  try {
    const { active } = req.query;
    
    const filter = {};
    if (active !== undefined) {
      filter.active = active === 'true';
    }

    const regions = await FreightRegion.find(filter).sort({ name: 1 });

    res.json({
      success: true,
      data: regions
    });

  } catch (error) {
    console.error('Erro ao listar regiões:', error);
    
    // Dados de fallback quando não há conexão com o banco
    const fallbackRegions = [
      {
        _id: 'fallback1',
        name: 'São Paulo - Capital',
        state: 'SP',
        cities: ['São Paulo'],
        price: 15.00,
        freeShippingThreshold: 200.00,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'fallback2',
        name: 'Rio de Janeiro - Capital',
        state: 'RJ',
        cities: ['Rio de Janeiro'],
        price: 18.00,
        freeShippingThreshold: 250.00,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'fallback3',
        name: 'Minas Gerais - Região Metropolitana',
        state: 'MG',
        cities: ['Belo Horizonte', 'Contagem', 'Betim'],
        price: 20.00,
        freeShippingThreshold: 300.00,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    res.json({
      success: true,
      data: fallbackRegions
    });
  }
};

// Criar região de frete
const createFreightRegion = async (req, res) => {
  try {
    const {
      name,
      states,
      cities = [],
      basePrice,
      pricePerKg = 0,
      freeShippingThreshold = 0,
      deliveryTime,
      isFreeShipping = false
    } = req.body;

    // Validações
    if (!name || !states || !Array.isArray(states) || states.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Nome e estados são obrigatórios"
      });
    }

    // Se não for frete grátis, validar preço base
    if (!isFreeShipping && (!basePrice || basePrice < 0)) {
      return res.status(400).json({
        success: false,
        message: "Preço base deve ser maior ou igual a zero"
      });
    }

    if (!deliveryTime || !deliveryTime.min || !deliveryTime.max) {
      return res.status(400).json({
        success: false,
        message: "Tempo de entrega (mín e máx) é obrigatório"
      });
    }

    const region = new FreightRegion({
      name,
      states,
      cities,
      basePrice: isFreeShipping ? 0 : basePrice,
      pricePerKg: isFreeShipping ? 0 : pricePerKg,
      freeShippingThreshold: isFreeShipping ? 0 : freeShippingThreshold,
      deliveryTime,
      isFreeShipping
    });

    await region.save();

    res.status(201).json({
      success: true,
      data: region,
      message: "Região de frete criada com sucesso"
    });

  } catch (error) {
    console.error('Erro ao criar região:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Já existe uma região com este nome"
      });
    }

    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
};

// Atualizar região de frete
const updateFreightRegion = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Se for frete grátis, zerar os preços
    if (updateData.isFreeShipping) {
      updateData.basePrice = 0;
      updateData.pricePerKg = 0;
      updateData.freeShippingThreshold = 0;
    }

    const region = await FreightRegion.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!region) {
      return res.status(404).json({
        success: false,
        message: "Região não encontrada"
      });
    }

    res.json({
      success: true,
      data: region,
      message: "Região atualizada com sucesso"
    });

  } catch (error) {
    console.error('Erro ao atualizar região:', error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
};

// Deletar região de frete
const deleteFreightRegion = async (req, res) => {
  try {
    const { id } = req.params;

    const region = await FreightRegion.findByIdAndDelete(id);

    if (!region) {
      return res.status(404).json({
        success: false,
        message: "Região não encontrada"
      });
    }

    res.json({
      success: true,
      message: "Região deletada com sucesso"
    });

  } catch (error) {
    console.error('Erro ao deletar região:', error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
};

// Obter região específica
const getFreightRegion = async (req, res) => {
  try {
    const { id } = req.params;

    const region = await FreightRegion.findById(id);

    if (!region) {
      return res.status(404).json({
        success: false,
        message: "Região não encontrada"
      });
    }

    res.json({
      success: true,
      data: region
    });

  } catch (error) {
    console.error('Erro ao buscar região:', error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
};

// Ativar/Desativar região
const toggleFreightRegion = async (req, res) => {
  try {
    const { id } = req.params;

    const region = await FreightRegion.findById(id);

    if (!region) {
      return res.status(404).json({
        success: false,
        message: "Região não encontrada"
      });
    }

    region.active = !region.active;
    await region.save();

    res.json({
      success: true,
      data: region,
      message: `Região ${region.active ? 'ativada' : 'desativada'} com sucesso`
    });

  } catch (error) {
    console.error('Erro ao alterar status da região:', error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
};

export {
  calculateFreightByCEP,
  getCEPInfo,
  listFreightRegions,
  createFreightRegion,
  updateFreightRegion,
  deleteFreightRegion,
  getFreightRegion,
  toggleFreightRegion
};