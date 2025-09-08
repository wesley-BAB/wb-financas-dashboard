import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import Layout from '@/components/Layout';
import { typesApi } from '@/services/mockApi';
import { Type } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'react-toastify';

const Types: React.FC = () => {
  const [types, setTypes] = useState<Type[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<Type | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '' });

  useEffect(() => {
    loadTypes();
  }, []);

  const loadTypes = () => {
    const data = typesApi.getAll();
    setTypes(data);
  };

  const resetForm = () => {
    setFormData({ name: '' });
    setEditingType(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingType) {
        typesApi.update(editingType.id, formData);
        toast.success('Tipo atualizado com sucesso!');
      } else {
        typesApi.create(formData);
        toast.success('Tipo criado com sucesso!');
      }

      loadTypes();
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Erro ao salvar tipo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (type: Type) => {
    setEditingType(type);
    setFormData({ name: type.name });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este tipo?')) {
      typesApi.delete(id);
      toast.success('Tipo excluído com sucesso!');
      loadTypes();
    }
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
            <h1 className="text-3xl font-bold text-foreground">Tipos</h1>
            <p className="text-muted-foreground">
              Gerencie os tipos de transações (Receita/Despesa)
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-white" onClick={resetForm}>
                <Plus size={16} />
                Novo Tipo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingType ? 'Editar Tipo' : 'Novo Tipo'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Tipo</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Digite o nome do tipo"
                    required
                    className="finance-input"
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
                    {editingType ? 'Atualizar' : 'Criar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Types Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="finance-card">
            <CardHeader>
              <CardTitle>Tipos Cadastrados ({types.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {types.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {types.map((type, index) => (
                    <motion.div
                      key={type.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="finance-card p-4 hover:shadow-[var(--shadow-elevation)] transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          type.name.toLowerCase().includes('receita') 
                            ? 'bg-success/20' 
                            : 'bg-destructive/20'
                        }`}>
                          <Tag className={
                            type.name.toLowerCase().includes('receita') 
                              ? 'text-success' 
                              : 'text-destructive'
                          } size={20} />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(type)}
                          >
                            <Edit size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(type.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{type.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Criado em {new Date(type.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Tag size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Nenhum tipo encontrado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Types;