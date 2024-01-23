import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

export default function Test({ navigation }: any) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const handleGuardar = () => {
    // Agrega aquí la lógica para guardar la información del usuario
    console.log('Información guardada:', { fullName, email, phone, password, passwordConfirmation });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.formContainer}>
            <Text style={styles.label}>Nombre completo:</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={(text) => setFullName(text)}
            //   onFocus={() => ScrollView.scrollTo({ x: 0, y: 0, animated: true })} // Agregado para Android
            />

            <Text style={styles.label}>Correo electrónico:</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={(text) => setEmail(text)}
              keyboardType="email-address"
            //   onFocus={() => ScrollView.scrollTo({ x: 0, y: 0, animated: true })} // Agregado para Android
            />

            <Text style={styles.label}>Número de teléfono:</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={(text) => setPhone(text)}
              keyboardType="phone-pad"
            //   onFocus={() => ScrollView.scrollTo({ x: 0, y: 0, animated: true })} // Agregado para Android
            />

            <Text style={styles.label}>Contraseña:</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry
            //   onFocus={() => ScrollView.scrollTo({ x: 0, y: 0, animated: true })} // Agregado para Android
            />

            <Text style={styles.label}>Confirmar contraseña:</Text>
            <TextInput
              style={styles.input}
              value={passwordConfirmation}
              onChangeText={(text) => setPasswordConfirmation(text)}
              secureTextEntry
            //   onFocus={() => ScrollView.scrollTo({ x: 0, y: 0, animated: true })} // Agregado para Android
            />
            <Text style={styles.label}>Confirmar contraseña:</Text>
            <TextInput
              style={styles.input}
              value={passwordConfirmation}
              onChangeText={(text) => setPasswordConfirmation(text)}
              secureTextEntry
            //   onFocus={() => ScrollView.scrollTo({ x: 0, y: 0, animated: true })} // Agregado para Android
            />
            <Text style={styles.label}>Confirmar contraseña:</Text>
            <TextInput
              style={styles.input}
              value={passwordConfirmation}
              onChangeText={(text) => setPasswordConfirmation(text)}
              secureTextEntry
            //   onFocus={() => ScrollView.scrollTo({ x: 0, y: 0, animated: true })} // Agregado para Android
            />

            {/* Agregar aquí el componente para los "Términos y condiciones" */}

            <Button title="Guardar" onPress={handleGuardar} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 90,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});


