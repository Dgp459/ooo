import React, { useState, useEffect } from 'react';
import { SafeAreaView, FlatList, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ListaScreen({ navigation }) {
  const [registros, setRegistros] = useState([]);
  
  useEffect(() => { carregar(); }, []);
  
  const carregar = async () => {
    const dados = await AsyncStorage.getItem('registros');
    if (dados) setRegistros(JSON.parse(dados));
  };
  
  const apagar = (id) => {
    Alert.alert('Apagar', 'Deseja apagar?', [
      { text: 'Não' },
      { text: 'Sim', onPress: async () => {
        const novos = registros.filter(r => r.id !== id);
        setRegistros(novos);
        await AsyncStorage.setItem('registros', JSON.stringify(novos));
      }}
    ]);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>📄 Registros ({registros.length})</Text>
      </View>
      
      {registros.length === 0 ? (
        <View style={styles.vazio}>
          <Text style={styles.vazioTexto}>Nenhum registro salvo</Text>
          <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.navigate('Registro')}>
            <Text style={styles.botaoTexto}>➕ Criar Registro</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={registros}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitulo}>{item.pontoBase}</Text>
                  <TouchableOpacity onPress={() => apagar(item.id)}>
                    <Text style={styles.apagar}>🗑️</Text>
                  </TouchableOpacity>
                </View>
                <Text>OMÉ: {item.ome || 'Não informado'}</Text>
                <Text>Viatura: {item.tipoOrdem} - {item.numeroOrdem}</Text>
                <Text>Ocorrência: {item.tipoOcorrencia}</Text>
                <Text>Data: {item.data}</Text>
              </View>
            )}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.lista}
          />
          
          <View style={styles.rodape}>
            <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.navigate('Registro')}>
              <Text style={styles.botaoTexto}>📝 Novo Registro</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { padding: 20, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#ddd' },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#2c3e50', textAlign: 'center' },
  lista: { padding: 15, paddingBottom: 80 },
  card: { backgroundColor: 'white', borderRadius: 10, padding: 15, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardTitulo: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50' },
  apagar: { fontSize: 20 },
  vazio: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  vazioTexto: { fontSize: 16, color: '#7f8c8d', marginBottom: 20 },
  rodape: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white', padding: 15, borderTopWidth: 1, borderTopColor: '#ddd' },
  botaoVoltar: { backgroundColor: '#3498db', borderRadius: 10, padding: 15, alignItems: 'center' },
  botaoTexto: { color: 'white', fontWeight: 'bold', fontSize: 14 },
});