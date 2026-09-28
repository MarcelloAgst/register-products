import { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Product, CreateProductDTO, UpdateProductDTO } from "../types/Product";

interface ProductModalProps {
  visible: boolean;
  productToEdit: Product | null;
  onClose: () => void;
  onSave: (
    productData: CreateProductDTO | UpdateProductDTO,
    id?: number | string,
  ) => Promise<void>;
}

export const ProductModal = ({
  visible,
  productToEdit,
  onClose,
  onSave,
}: ProductModalProps) => {
  // Campos para criar ou editar produtos
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [preco, setPreco] = useState("");
  const [quantidade, setQuantidade] = useState("");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const isEditing = !!productToEdit;

  useEffect(() => {
    if (productToEdit) {
      setNome(productToEdit.nome);
      setDescricao(productToEdit.descricao);
      setCategoria(
        productToEdit.categoria ||
        (productToEdit.categoria_id
          ? String(productToEdit.categoria_id)
          : "Eletrônicos"),
      );
      setPreco(
        productToEdit.preco !== undefined ? String(productToEdit.preco) : "",
      );
      setQuantidade(
        String(
          productToEdit.quantidade_estoque ?? productToEdit.quantidade ?? 0,
        ),
      );
    } else {
      setNome("");
      setDescricao("");
      setCategoria("Eletrônicos");
      setPreco("");
      setQuantidade("");
    }

    setErrors({});
  }, [productToEdit, visible]);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!nome.trim()) {
      newErrors.nome = "O nome do produto é obrigatório.";
    }

    if (!descricao.trim()) {
      newErrors.descricao = "A descrição do produto é obrigatória.";
    }

    if (!categoria.trim()) {
      newErrors.categoria = "A categoria do produto é obrigatória.";
    }

    const numericPrice = parseFloat(preco.replace(",", "."));
    if (!preco.trim() || isNaN(numericPrice) || numericPrice <= 0) {
      newErrors.preco = "Informe um preço válido maior que zero";
    }

    const numericQty = parseInt(quantidade, 10);
    if (!quantidade.trim() || isNaN(numericQty) || numericQty <= 0) {
      newErrors.quantidade =
        "Informe uma quantidade de estoque válida (0 ou mais)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async () => {
    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      const numericPrice = parseFloat(preco.replace(",", "."));
      const numericQty = parseInt(quantidade, 10);

      const payload = {
        nome: nome.trim(),
        descricao: descricao.trim(),
        categoria: categoria.trim(),
        preco: numericPrice,
        quantidade: numericQty,
        quantidade_estoque: numericQty,
        categoria_id: productToEdit?.categoria_id || 1,
      };

      await onSave(payload, productToEdit?.id);

      Alert.alert(
        "Sucesso!",
        isEditing
          ? "Produto atualizado com sucesso"
          : "Produto cadastrado com sucesso",
      );

      onClose();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Erro ao processar requisição";
      Alert.alert("Erro na operação", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      {/*  */}
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.modalContainer}>
          <View style={styles.headerModal}>
            <Text style={styles.headerTitle}>
              {isEditing ? "Editar Produto" : "Novo Produto"}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>x</Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Nome */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome do Produto *</Text>
              <TextInput
                style={[styles.input, errors.nome ? styles.inputError : null]}
                placeholder="Ex: Smartphone Galaxy S23"
                placeholderTextColor="#94A3B8"
                value={nome}
                onChangeText={setNome}
              />
              {errors.nome ? (
                <Text style={styles.errorText}>{errors.nome}</Text>
              ) : null}
            </View>

            {/* Descrição */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descrição *</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  errors.descricao ? styles.inputError : null,
                ]}
                placeholder="Informe detalhes sobre o produto..."
                placeholderTextColor="#94A3B8"
                multiline={true}
                numberOfLines={3}
                value={descricao}
                onChangeText={setDescricao}
              />
              {errors.descricao ? (
                <Text style={styles.errorText}>{errors.descricao}</Text>
              ) : null}
            </View>

            {/* Categoria */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Categoria *</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.categoria ? styles.inputError : null,
                ]}
                placeholder="Ex: Eletrônicos, Vestuário, Alimentos"
                placeholderTextColor="#94A3B8"
                value={categoria}
                onChangeText={setCategoria}
              />
              {errors.categoria ? (
                <Text style={styles.errorText}>{errors.categoria}</Text>
              ) : null}
            </View>

            <View style={styles.row}>
              {/* Preço */}
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Preço (R$) *</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.preco ? styles.inputError : null,
                  ]}
                  placeholder="0.00"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={preco}
                  onChangeText={setPreco}
                />
                {errors.preco ? (
                  <Text style={styles.errorText}>{errors.preco}</Text>
                ) : null}
              </View>

              {/* Quantidade */}
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Estoque (Qtd) *</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.quantidade ? styles.inputError : null,
                  ]}
                  placeholder="0"
                  placeholderTextColor="#94A3B8"
                  keyboardType="number-pad"
                  value={quantidade}
                  onChangeText={setQuantidade}
                />
                {errors.quantidade ? (
                  <Text style={styles.errorText}>{errors.quantidade}</Text>
                ) : null}
              </View>
            </View>
          </View>

          {/* Footer Actions */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveBtn, loading ? styles.saveBtnDisabled : null]}
              onPress={handleFormSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.saveBtnText}>
                  {isEditing ? "Atualizar" : "Cadastrar"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "flex-end",
  },

  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "88%",
    paddingBottom: Platform.OS === "ios" ? 24 : 16,
  },
  headerModal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 20,
    color: "#64748B",
    fontWeight: "600",
  },

  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: "#1E293B",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#475569",
  },
  saveBtn: {
    flex: 1.5,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnDisabled: {
    backgroundColor: "#93C5FD",
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

