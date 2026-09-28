import { SafeAreaView } from "react-native";
import { useEffect, useState } from "react";
import { StyleSheet, StatusBar, Text, View, FlatList, TouchableOpacity, ActivityIndicator, Alert, RefreshControl, Platform, Modal } from "react-native";

import { Product, CreateProductDTO, UpdateProductDTO } from "./src/types/Product";
import { productService } from "./src/services/productServices";
import { ProductCard } from "./src/components/ProductCard";
import { ProductModal } from "./src/components/ProductModal";

export default function App() {

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [refreshing, setRefreshing] = useState<boolean>(false)

  // Controle do Modal
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [productToEdit, setProductToEdit] = useState<Product | null>(null)

  // Carregar produtos da API
  const fetchProducts = async () => {
    try {
      const data = await productService.getProducts()
      setProducts(data)
    } catch (error) {
      console.error(error)
      Alert.alert('Erro ao carregar produtos')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleRefresh = () => {
    setLoading(true)
    fetchProducts()
  }

  // Abrir Modal para criar um novo produto
  const handleOpenCreateModal = () => {
    setProductToEdit(null)
    setModalVisible(true)
  }

  // Abrir Modal para editar um produto
  const handleOpenEditModal = (product: Product) => {
    setProductToEdit(product)
    setModalVisible(true)
  }

  // Salvar (Cadastrar ou Editar)
  const handleSaveProduct = async (
    productData: CreateProductDTO | UpdateProductDTO,
    id?: number | string
  ) => {
    if (id !== undefined && id !== null){
      // Edição
      await productService.updateProducts(id, productData)
    } else {
      // Cadastro
      await productService.createProducts(productData)
    }
    // Atualizar lista
    await fetchProducts()
  }

  const handleDeleteProductWeb = (product: Product) => {
  if (!product.id) return;

  const confirmDelete = window.confirm(
    `Tem certeza que deseja excluir ${product.nome}?`
  );

  if (!confirmDelete) return;

  const deleteProduct = async () => {
    try {
      setLoading(true);
      
      await productService.deleteProducts(product.id!);

      window.alert("Produto excluído com sucesso!");

      await fetchProducts();
    } catch (error) {
      window.alert("Erro ao excluir produto");
    } finally {
      setLoading(false);
    }
  };

  deleteProduct();
};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor='#F8FAFC'/>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Produtos</Text>
          <Text style={styles.subtitle}>Gerenciamento de Estoque & Catálogo</Text>
        </View>
        <TouchableOpacity style={styles.newProductButton} onPress={handleOpenCreateModal}>
          <Text style={styles.newProductButtonText}>+ Novo Produto</Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo Principal / Lista de Produtos */}
      {loading && refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size='large' color='#2563EB' />
          <Text style={styles.loadingText}>Carregando produtos...</Text>
        </View>
      ) : (
        <FlatList
        data={products}
        keyExtractor={(item, index) => (item.id ? String(item.id) : String(index))}   
        renderItem={({item}) => (
          <ProductCard 
          item={item}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteProductWeb}
          />
        )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📦</Text>
              <Text style={styles.emptyTitle}>Nenhum produto encontrado</Text>
              <Text style={styles.emptySubtitle}>
                Clique no botão acima para cadastrar seu primeiro produto no sistema.
              </Text>
              <TouchableOpacity
                style={styles.emptyActionButton}
                onPress={handleOpenCreateModal}
              >
                <Text style={styles.emptyActionButtonText}>Cadastrar Produto</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      <ProductModal 
        visible={modalVisible}
        productToEdit={productToEdit}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveProduct}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },

  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
  },

  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },

  newProductButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  newProductButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F2F5',
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15
  },

  productName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4
  },

  categoryBadgeText: {
    color: '#2563EB',
    fontWeight: '600',
    textTransform: 'uppercase',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },

  priceText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#059669'
  },

  descriptionText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 14,
    lineHeight: 20,
  },

  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },

  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  stockDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  stockDotActive: {
    backgroundColor: '#10B981',
  },

  stockDotEmpty: {
    backgroundColor: '#EF4444',
  },

  stockText: {
    fontSize: 13,
    color: '#64748B',
  },

  stockValue: {
    fontWeight: '700',
    color: '#334155',
  },

  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },

  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  editButton: {
    backgroundColor: '#F1F5F9',
  },

  editButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },

  deleteButton: {
    backgroundColor: '#FEE2E2',
  },

  deleteButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#DC2626',
  },

  listContent: {
    padding: 16,
    paddingBottom: 32,
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },

  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },

  emptyActionButton: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  }, 

  emptyActionButtonText: {
    color: '#2563EB',
    fontWeight: '600',
    fontSize: 14,
  },

  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '88%',
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
  }, 

  headerModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },

  closeButton: {
    padding: 4,
  },

  closeButtonText: {
    fontSize: 20,
    color: '#64748B',
    fontWeight: '600',
  },
});