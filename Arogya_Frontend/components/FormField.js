import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Controller } from 'react-hook-form';

/* 
    inputProps: They are used for reusability when we need to add new features to the fields like maxLength or something. We don't need to hard-code everything and rather we can just use this argument.
    multiline: As the name suggests, when this is true, it helps to add multi lines to our TextInput. So like when you type something and hit enter, it adds a new line.
*/

export default function FormField({
  control,
  name,
  label,
  placeholder,
  rules,
  errors,
  inputProps = {},
  multiline = false
}) {

    // Checking if control and name are created or not so it doesn't throw any undefined error later 
  if (!control || !name) return null;

  const errorMessage = errors?.[name]?.message;

  return (
    <View style={{ marginBottom: 15 }}>
      <Text style={styles.label}>{label}</Text>

      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[
              styles.input,
              multiline && { height: 100, textAlignVertical: 'top' }
            ]}
            placeholder={placeholder}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            multiline={multiline}
            {...inputProps}
          />
        )}
      />

      {typeof errorMessage === 'string' && (
        <Text style={styles.error}>{errorMessage}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontWeight: 'bold',
    marginBottom: 5
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    padding: 10
  },
  error: {
    color: 'red',
    marginTop: 5
  }
});
