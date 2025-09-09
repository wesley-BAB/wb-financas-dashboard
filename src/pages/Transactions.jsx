import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Edit, 
  Trash2, 
  Calendar,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { transactionsApi, categoriesApi, typesApi } from '@/services/mockApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-toastify';

const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const reportRef = useRef(null);

  // Form states
  const [formData, setFormData] = useState({
    categoryId: '',
    typeId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  useEffect(() => {
    loadData();
  }, [user]);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchTerm, startDate, endDate, selectedCategory, selectedType]);

  const loadData = () => {
    const transactionsData = transactionsApi.getAll(user?.id);
    const categoriesData = categoriesApi.getAll();
    const typesData = typesApi.getAll();
    
    setTransactions(transactionsData);
    setCategories(categoriesData);
    setTypes(typesData);
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.typeName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (startDate) {
      filtered = filtered.filter(t => t.date >= startDate);
    }

    if (endDate) {
      filtered = filtered.filter(t => t.date <= endDate);
    }

    if (selectedCategory) {
      filtered = filtered.filter(t => t.categoryId === selectedCategory);
    }

    if (selectedType) {
      filtered = filtered.filter(t => t.typeId === selectedType);
    }

    setFilteredTransactions(filtered);
  };

  const resetForm = () => {
    setFormData({
      categoryId: '',
      typeId: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
    setEditingTransaction(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const transactionData = {
        userId: user.id,
        categoryId: formData.categoryId,
        typeId: formData.typeId,
        amount: parseFloat(formData.amount),
        date: formData.date,
        description: formData.description
      };

      if (editingTransaction) {
        transactionsApi.update(editingTransaction.id, transactionData);
        toast.success('Transação atualizada com sucesso!');
      } else {
        transactionsApi.create(transactionData);
        toast.success('Transação criada com sucesso!');
      }

      loadData();
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Erro ao salvar transação');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      categoryId: transaction.categoryId,
      typeId: transaction.typeId,
      amount: transaction.amount.toString(),
      date: transaction.date,
      description: transaction.description
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      transactionsApi.delete(id);
      toast.success('Transação excluída com sucesso!');
      loadData();
    }
  };

  const exportToPDF = async () => {
    if (!reportRef.current) return;

    try {
      setIsLoading(true);
      const canvas = await html2canvas(reportRef.current);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF();
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`relatorio-transacoes-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('Relatório exportado com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar relatório');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getTotalIncome = () => {
    return filteredTransactions
      .filter(t => t.typeName.toLowerCase().includes('receita'))
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalExpenses = () => {
    return filteredTransactions
      .filter(t => t.typeName.toLowerCase().includes('despesa'))
      .reduce((sum, t) => sum + t.amount, 0);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">Movimentações</h1>
            <p className="text-muted-foreground">
              Gerencie suas transações financeiras
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={exportToPDF} variant="outline" disabled={isLoading}>
              <Download size={16} />
              Exportar PDF
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-primary text-white" onClick={resetForm}>
                  <Plus size={16} />
                  Nova Transação
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Categoria</Label>
                      <Select
                        value={formData.categoryId}
                        onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Tipo</Label>
                      <Select
                        value={formData.typeId}
                        onValueChange={(value) => setFormData({ ...formData, typeId: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {types.map(type => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Valor</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        placeholder="0,00"
                        required
                        className="finance-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Data</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                        className="finance-input"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Digite uma descrição..."
                      required
                      className="finance-input min-h-[80px]"
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 gradient-primary text-white"
                      disabled={isLoading}
                    >
                      {editingTransaction ? 'Atualizar' : 'Criar'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="finance-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter size={20} className="text-primary" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label>Buscar</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                      placeholder="Buscar transações..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 finance-input"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Data Inicial</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="finance-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Data Final</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="finance-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      {types.map(type => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Card className="finance-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                  <TrendingUp className="text-success" size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total de Receitas</p>
                  <p className="text-xl font-bold text-success">{formatCurrency(getTotalIncome())}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="finance-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
                  <TrendingDown className="text-destructive" size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total de Despesas</p>
                  <p className="text-xl font-bold text-destructive">{formatCurrency(getTotalExpenses())}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="finance-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  getTotalIncome() - getTotalExpenses() >= 0 
                    ? 'bg-success/20' 
                    : 'bg-destructive/20'
                }`}>
                  <Calendar className={
                    getTotalIncome() - getTotalExpenses() >= 0 
                      ? 'text-success' 
                      : 'text-destructive'
                  } size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Saldo do Período</p>
                  <p className={`text-xl font-bold ${
                    getTotalIncome() - getTotalExpenses() >= 0 
                      ? 'text-success' 
                      : 'text-destructive'
                  }`}>
                    {formatCurrency(getTotalIncome() - getTotalExpenses())}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Transactions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          ref={reportRef}
        >
          <Card className="finance-card">
            <CardHeader>
              <CardTitle>Transações ({filteredTransactions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredTransactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3 font-medium text-muted-foreground">Data</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Descrição</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Categoria</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Tipo</th>
                        <th className="text-right p-3 font-medium text-muted-foreground">Valor</th>
                        <th className="text-center p-3 font-medium text-muted-foreground">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((transaction, index) => (
                        <motion.tr
                          key={transaction.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="border-b border-border hover:bg-muted/30 transition-colors"
                        >
                          <td className="p-3 text-sm">
                            {new Date(transaction.date).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="p-3">
                            <div className="font-medium text-foreground">{transaction.description}</div>
                          </td>
                          <td className="p-3 text-sm text-muted-foreground">
                            {transaction.categoryName}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              transaction.typeName.toLowerCase().includes('receita')
                                ? 'bg-success/20 text-success'
                                : 'bg-destructive/20 text-destructive'
                            }`}>
                              {transaction.typeName}
                            </span>
                          </td>
                          <td className={`p-3 text-right font-medium ${
                            transaction.typeName.toLowerCase().includes('receita')
                              ? 'text-success'
                              : 'text-destructive'
                          }`}>
                            {transaction.typeName.toLowerCase().includes('receita') ? '+' : '-'}
                            {formatCurrency(Math.abs(transaction.amount))}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(transaction)}
                              >
                                <Edit size={14} />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(transaction.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Nenhuma transação encontrada</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Transactions;