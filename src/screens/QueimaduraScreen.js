import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function QueimaduraScreen({ route, navigation }) {
  const [tipoPaciente, setTipoPaciente] = useState('');
  const [parteCorpo, setParteCorpo] = useState('');
  const [porcentagem, setPorcentagem] = useState('');
  const [pupilas, setPupilas] = useState('');
  const [temperatura, setTemperatura] = useState('');
  const [pressao, setPressao] = useState('');
  const [frequenciaCardiaca, setFrequenciaCardiaca] = useState('');
  const [superficieAtingida, setSuperficieAtingida] = useState('');
  const [frequenciaRespiratoria, setFrequenciaRespiratoria] = useState('');
  const [viasAereas, setViasAereas] = useState('');
  const [graus, setGraus] = useState([]);

  const opcoesPupilas = ['Nenhuma pupila responde', 'Apenas uma responde', 'As duas respondem'];

  const salvarQueimadura = () => {
    Alert.alert('✅ Salvo!', 'Dados de queimadura registrados');
    navigation.goBack();
  };

  const toggleGrau = (grau) => {
    setGraus(prev => prev.includes(grau) ? prev.filter(g => g !== grau) : [...prev, grau]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.titulo}>🔴 REGISTRO DE QUEIMADURA</Text>

        {/* Tipo Paciente */}
        <Text style={styles.label}>Tipo de Paciente:</Text>
        <View style={styles.linha}>
          <TouchableOpacity 
            style={[styles.botaoOpcao, tipoPaciente === 'adulto' && styles.botaoSelecionado]}
            onPress={() => setTipoPaciente('adulto')}
          >
            <Text>Adulto</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.botaoOpcao, tipoPaciente === 'crianca' && styles.botaoSelecionado]}
            onPress={() => setTipoPaciente('crianca')}
          >
            <Text>Criança</Text>
          </TouchableOpacity>
        </View>

        {/* Campos de texto */}
        <CampoTexto label="Parte do Corpo:" value={parteCorpo} onChange={setParteCorpo} />
        <CampoTexto label="Porcentagem da queimadura:" value={porcentagem} onChange={setPorcentagem} />
        <CampoTexto label="Temperatura (°C):" value={temperatura} onChange={setTemperatura} />
        <CampoTexto label="Pressão Arterial:" value={pressao} onChange={setPressao} />
        <CampoTexto label="Frequência cardíaca:" value={frequenciaCardiaca} onChange={setFrequenciaCardiaca} />
        <CampoTexto label="Superfície atingida %:" value={superficieAtingida} onChange={setSuperficieAtingida} />
        <CampoTexto label="Frequência respiratória:" value={frequenciaRespiratoria} onChange={setFrequenciaRespiratoria} />

        {/* Pupilas */}
        <Text style={styles.label}>Pupilas:</Text>
        {opcoesPupilas.map(opcao => (
          <TouchableOpacity 
            key={opcao}
            style={[styles.opcao, pupilas === opcao && styles.opcaoSelecionada]}
            onPress={() => setPupilas(opcao)}
          >
            <Text>{opcao}</Text>
          </TouchableOpacity>
        ))}

        {/* Vias Aéreas */}
        <Text style={styles.label}>Vias aéreas atingidas:</Text>
        <View style={styles.linha}>
          <TouchableOpacity 
            style={[styles.botaoSimNao, viasAereas === 'sim' && styles.botaoSimNaoSelecionado]}
            onPress={() => setViasAereas('sim')}
          >
            <Text>Sim</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.botaoSimNao, viasAereas === 'nao' && styles.botaoSimNaoSelecionado]}
            onPress={() => setViasAereas('nao')}
          >
            <Text>Não</Text>
          </TouchableOpacity>
        </View>

        {/* Graus */}
        <Text style={styles.label}>Grau:</Text>
        <View style={styles.linha}>
          {[1, 2, 3].map(grau => (
            <TouchableOpacity 
              key={grau}
              style={[styles.botaoGrau, graus.includes(grau) && styles.botaoGrauSelecionado]}
              onPress={() => toggleGrau(grau)}
            >
              <Text>{grau}º grau</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ESPAÇO PARA O BOTÃO NÃO FICAR ESCONDIDO */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* BOTÃO FIXO VISÍVEL */}
      <View style={styles.botaoFixo}>
        <TouchableOpacity style={styles.botaoSalvar} onPress={salvarQueimadura}>
          <Text style={styles.botaoTexto}>💾 SALVAR QUEIMADURA</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const CampoTexto = ({ label, value, onChange }) => (
  <View style={styles.campoContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      placeholder="Digite aqui"
      value={value}
      onChangeText={onChange}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF3E0' },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 100 }, // MAIS ESPAÇO
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#D32F2F', textAlign: 'center', marginBottom: 20 },
  campoContainer: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: '600', color: '#5D4037', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#FFB74D', borderRadius: 8, padding: 12, backgroundColor: '#FFF8E1' },
  linha: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  botaoOpcao: { flex: 1, padding: 12, borderWidth: 1, borderColor: '#FFB74D', borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
  botaoSelecionado: { backgroundColor: '#FFB74D' },
  opcao: { padding: 12, borderWidth: 1, borderColor: '#FFCC80', borderRadius: 8, marginBottom: 5 },
  opcaoSelecionada: { backgroundColor: '#FFE0B2', borderColor: '#FF9800' },
  botaoSimNao: { flex: 1, padding: 12, borderWidth: 1, borderColor: '#FF8A65', borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
  botaoSimNaoSelecionado: { backgroundColor: '#FFAB91' },
  botaoGrau: { flex: 1, padding: 10, borderWidth: 1, borderColor: '#FF7043', borderRadius: 8, alignItems: 'center', marginHorizontal: 2 },
  botaoGrauSelecionado: { backgroundColor: '#FF8A65' },
  botaoFixo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  botaoSalvar: { backgroundColor: '#D32F2F', padding: 16, borderRadius: 10, alignItems: 'center' },
  botaoTexto: { color: 'white', fontWeight: 'bold' },
});
