/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Home, 
  DollarSign, 
  Plus, 
  Trash2, 
  Send, 
  RotateCcw, 
  Key,
  CheckCircle2,
  AlertCircle,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Tenant, Property, Values, UserType, AttendantName } from './types';

// Helper for currency formatting
const formatCurrency = (value: string) => {
  const digits = value.replace(/\D/g, '');
  const amount = parseInt(digits) / 100;
  if (isNaN(amount)) return '';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
};

// Helper for CPF masking
const formatCPF = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

// Helper for Phone masking
const formatPhone = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1');
};

export default function App() {
  const [userType, setUserType] = useState<UserType>('Cliente');
  const [attendantName, setAttendantName] = useState<AttendantName>('Atendimento');
  const [tenants, setTenants] = useState<Tenant[]>([
    { id: crypto.randomUUID(), name: '', cpf: '', email: '', phone: '', isPrincipal: true }
  ]);
  const [property, setProperty] = useState<Property>({
    cep: '',
    number: '',
    complement: '',
    type: 'Casa',
    flexCode: ''
  });
  const [values, setValues] = useState<Values>({
    rent: '',
    iptu: '',
    condo: ''
  });

  const addTenant = () => {
    if (tenants.length >= 5) return;
    setTenants([
      ...tenants,
      { id: crypto.randomUUID(), name: '', cpf: '', email: '', phone: '', isPrincipal: false }
    ]);
  };

  const removeTenant = (id: string) => {
    if (tenants.length <= 1) return;
    setTenants(tenants.filter(t => t.id !== id));
  };

  const updateTenant = (id: string, field: keyof Tenant, value: string) => {
    setTenants(tenants.map(t => {
      if (t.id === id) {
        let formattedValue = value;
        if (field === 'cpf') formattedValue = formatCPF(value);
        if (field === 'phone') formattedValue = formatPhone(value);
        return { ...t, [field]: formattedValue };
      }
      return t;
    }));
  };

  const updateValue = (field: keyof Values, value: string) => {
    const digits = value.replace(/\D/g, '');
    setValues({ ...values, [field]: digits });
  };

  const resetForm = () => {
    if (confirm('Deseja limpar todos os dados do formulário?')) {
      setUserType('Cliente');
      setAttendantName('Atendimento');
      setTenants([{ id: crypto.randomUUID(), name: '', cpf: '', email: '', phone: '', isPrincipal: true }]);
      setProperty({ cep: '', number: '', complement: '', type: 'Casa', flexCode: '' });
      setValues({ rent: '', iptu: '', condo: '' });
    }
  };

  const sendToWhatsApp = () => {
    const phone = "5515996367478";
    
    // Validation
    const isTenantsValid = tenants.every(t => t.name && t.cpf && t.email && t.phone);
    if (!isTenantsValid || !property.cep || !values.rent) {
      alert("Por favor, preencha todos os campos obrigatórios (*)");
      return;
    }

    let tenantText = "";
    tenants.forEach((t, i) => {
      tenantText += `👤 *LOCATÁRIO ${i + 1}${t.isPrincipal ? ' (PRINCIPAL)' : ''}:*\n`;
      tenantText += `Nome: ${t.name.toUpperCase()}\n`;
      tenantText += `CPF: ${t.cpf}\n`;
      tenantText += `E-mail: ${t.email}\n`;
      tenantText += `Celular: ${t.phone}\n\n`;
    });

    const message = `*NOVA ANÁLISE: FIANÇA LOCATICIA*\n\n` +
      `👤 *USUÁRIO:* ${userType}\n` +
      `🎧 *ATENDENTE:* ${attendantName}\n\n` +
      tenantText +
      `🏠 *IMÓVEL:*\n` +
      `Tipo: ${property.type}\n` +
      `CEP: ${property.cep}\n` +
      `Número: ${property.number || '-'}\n` +
      `Comp: ${property.complement || '-'}\n` +
      `Código Flex: ${property.flexCode || '-'}\n\n` +
      `💰 *VALORES MENSAIS:*\n` +
      `Valor do Aluguel: ${formatCurrency(values.rent)}\n` +
      `IPTU: ${formatCurrency(values.iptu) || 'R$ 0,00'}\n` +
      `Condomínio: ${formatCurrency(values.condo) || 'R$ 0,00'}\n\n` +
      `_Enviado via FIANÇA LOCATICIA - Consultoria Marcelo Fernandes_`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      <div className="max-w-md mx-auto px-4 pt-6">
        
        {/* Header */}
        <header className="bg-[#004691] p-6 rounded-[2rem] text-white mb-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <Key className="w-5 h-5 text-amber-400" />
              <h1 className="text-2xl font-black italic tracking-tighter uppercase">FIANÇA LOCATICIA</h1>
            </div>
            <p className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.2em]">Consultoria Marcelo Fernandes</p>
          </div>
          <Key className="absolute -right-6 -bottom-6 w-32 h-32 opacity-10 rotate-12 text-white" />
        </header>

        <main className="space-y-6">
          
          {/* Section 0: User and Service */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#004691]" /> Usuário e Atendimento
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-bold text-slate-400 ml-1 mb-1 block uppercase tracking-wider">Usuário</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setUserType('Cliente')}
                    className={`py-3 rounded-xl text-xs font-bold transition-all ${userType === 'Cliente' ? 'bg-[#004691] text-white shadow-md' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}
                  >
                    Cliente
                  </button>
                  <button
                    onClick={() => setUserType('Corretor de Imóveis')}
                    className={`py-3 rounded-xl text-xs font-bold transition-all ${userType === 'Corretor de Imóveis' ? 'bg-[#004691] text-white shadow-md' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}
                  >
                    Imobiliária
                  </button>
                </div>
              </div>
              
              <AnimatePresence>
                {userType === 'Corretor de Imóveis' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <label className="text-[9px] font-bold text-slate-400 ml-1 mb-1 block uppercase tracking-wider">Atendente</label>
                    <div className="relative">
                      <select
                        value={attendantName}
                        onChange={(e) => setAttendantName(e.target.value as AttendantName)}
                        className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-100 focus:border-[#004691] outline-none transition-all appearance-none"
                      >
                        <option value="Beth">Beth</option>
                        <option value="Otalivio">Otalivio</option>
                        <option value="Paulo">Paulo</option>
                        <option value="Ribera">Ribera</option>
                        <option value="Atendimento">Atendimento</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* Section 1: Tenants */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Users className="w-4 h-4 text-[#004691]" /> 1. Locatários (Análise)
              </h2>
              <span className="text-[10px] font-bold text-slate-300">{tenants.length}/5</span>
            </div>

            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {tenants.map((tenant, index) => (
                  <motion.div
                    key={tenant.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`relative p-5 rounded-2xl border-l-4 ${tenant.isPrincipal ? 'border-[#004691] bg-blue-50/30' : 'border-slate-300 bg-slate-50/50'}`}
                  >
                    <span className={`absolute -top-3 left-4 px-3 py-1 rounded-full text-[9px] font-bold text-white uppercase ${tenant.isPrincipal ? 'bg-[#004691]' : 'bg-slate-400'}`}>
                      {tenant.isPrincipal ? 'Principal' : `${index + 1}º Locatário`}
                    </span>
                    
                    {!tenant.isPrincipal && (
                      <button 
                        onClick={() => removeTenant(tenant.id)}
                        className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    <div className="space-y-3 mt-2">
                      <input
                        type="text"
                        placeholder="Nome Completo *"
                        value={tenant.name}
                        onChange={(e) => updateTenant(tenant.id, 'name', e.target.value)}
                        className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#004691] outline-none transition-all"
                      />
                      <input
                        type="text"
                        placeholder="CPF *"
                        inputMode="numeric"
                        value={tenant.cpf}
                        onChange={(e) => updateTenant(tenant.id, 'cpf', e.target.value)}
                        className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#004691] outline-none transition-all"
                      />
                      <input
                        type="email"
                        placeholder="E-mail *"
                        value={tenant.email}
                        onChange={(e) => updateTenant(tenant.id, 'email', e.target.value)}
                        className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#004691] outline-none transition-all"
                      />
                      <input
                        type="text"
                        placeholder="Celular/WhatsApp *"
                        inputMode="tel"
                        value={tenant.phone}
                        onChange={(e) => updateTenant(tenant.id, 'phone', e.target.value)}
                        className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#004691] outline-none transition-all"
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {tenants.length < 5 && (
              <button
                onClick={addTenant}
                className="w-full mt-6 py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold text-xs hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> ADICIONAR LOCATÁRIO
              </button>
            )}
          </section>

          {/* Section 2: Property */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Home className="w-4 h-4 text-[#004691]" /> 2. O Imóvel
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="CEP do Imóvel *"
                inputMode="numeric"
                value={property.cep}
                onChange={(e) => setProperty({ ...property, cep: e.target.value })}
                className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#004691] outline-none transition-all"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Número"
                  value={property.number}
                  onChange={(e) => setProperty({ ...property, number: e.target.value })}
                  className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#004691] outline-none transition-all"
                />
                <input
                  type="text"
                  placeholder="Comp."
                  value={property.complement}
                  onChange={(e) => setProperty({ ...property, complement: e.target.value })}
                  className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#004691] outline-none transition-all"
                />
              </div>
              <select
                value={property.type}
                onChange={(e) => setProperty({ ...property, type: e.target.value as Property['type'] })}
                className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-100 focus:border-[#004691] outline-none transition-all appearance-none"
              >
                <option value="Casa">Casa</option>
                <option value="Apartamento">Apartamento</option>
                <option value="Sala/Salão">Comercial (Sala/Salão)</option>
                <option value="Galpão">Galpão</option>
              </select>
              <input
                type="text"
                placeholder="Código Flex (Se houver)"
                value={property.flexCode}
                onChange={(e) => setProperty({ ...property, flexCode: e.target.value })}
                className="w-full p-3.5 bg-amber-50/50 border border-amber-100 rounded-xl text-sm focus:ring-2 focus:ring-amber-100 focus:border-amber-400 outline-none transition-all"
              />
            </div>
          </section>

          {/* Section 3: Values */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#004691]" /> 3. Mensalidades
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-bold text-[#004691] ml-1 mb-1 block uppercase tracking-wider">Aluguel R$ *</label>
                <input
                  type="text"
                  placeholder="R$ 0,00"
                  inputMode="numeric"
                  value={formatCurrency(values.rent)}
                  onChange={(e) => updateValue('rent', e.target.value)}
                  className="w-full p-4 bg-white border border-slate-200 rounded-xl text-lg font-bold text-[#004691] focus:ring-2 focus:ring-blue-100 focus:border-[#004691] outline-none transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 ml-1 mb-1 block uppercase tracking-wider">IPTU R$</label>
                  <input
                    type="text"
                    placeholder="R$ 0,00"
                    inputMode="numeric"
                    value={formatCurrency(values.iptu)}
                    onChange={(e) => updateValue('iptu', e.target.value)}
                    className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#004691] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 ml-1 mb-1 block uppercase tracking-wider">Condomínio R$</label>
                  <input
                    type="text"
                    placeholder="R$ 0,00"
                    inputMode="numeric"
                    value={formatCurrency(values.condo)}
                    onChange={(e) => updateValue('condo', e.target.value)}
                    className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#004691] outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="space-y-4 pt-4">
            <button
              onClick={sendToWhatsApp}
              className="w-full bg-[#004691] hover:bg-[#00356d] text-white font-black py-5 rounded-[2rem] shadow-xl text-lg uppercase italic flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
            >
              <Send className="w-5 h-5" /> Enviar p/ Marcelo
            </button>
            
            <button
              onClick={resetForm}
              className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-slate-600 font-bold py-2 text-[10px] uppercase tracking-[0.2em] transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Limpar Formulário
            </button>
          </div>

        </main>

        <footer className="mt-12 text-center">
          <p className="text-slate-400 text-[9px] uppercase font-bold tracking-widest italic">
            Marcelo Fernandes — Corretor de Seguros — SUSEP: 3H032J
          </p>
        </footer>
      </div>
    </div>
  );
}
