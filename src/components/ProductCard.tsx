import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Product } from "../types/Product";
import { productService } from "../services/productServices";
import { useState } from "react";
              
interface ProductCardProps{
  item: Product,
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

  export const ProductCard = ({
    item,
    onEdit,
    onDelete
  }: ProductCardProps) => {

    const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0)
  }

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.productName}>{item.nome}</Text>
          <Text style={styles.categoryBadgeText}>{item.categoria}</Text>
        </View>
        <Text style={styles.priceText}>{formatPrice(Number(item.preco))}</Text>
      </View>

      <Text style={styles.descriptionText}>
        {item.descricao || "Sem descrição cadastrada"}
      </Text>

      <View style={styles.footerRow}>
        <View style={styles.stockContainer}>
          <View
            style={[
              styles.stockDot,
              item.quantidade! > 0
                ? styles.stockDotActive
                : styles.stockDotEmpty,
            ]}
          />
          <Text style={styles.stockText}>
            Estoque:
            <Text style={styles.stockValue}>{item.quantidade} un.</Text>
          </Text>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => onEdit(item)}
          >
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => onDelete(item)}
          >
            <Text style={styles.deleteButtonText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    );
  };

const styles = StyleSheet.create({
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
});