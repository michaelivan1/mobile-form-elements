import { useState, type ReactNode } from 'react';
import {
  Alert,
  Button,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const GENDER_OPTIONS = ['Male', 'Female', 'Other', 'Prefer not to say'] as const;
const COUNTRY_OPTIONS = ['USA', 'UK', 'Canada', 'Australia', 'India', 'Germany', 'Japan', 'Brazil'] as const;
const COLOR_OPTIONS = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#000000', '#FFFFFF'] as const;

type Gender = (typeof GENDER_OPTIONS)[number];
type Country = (typeof COUNTRY_OPTIONS)[number];

type FormData = {
  text: string;
  password: string;
  showPassword: boolean;
  email: string;
  phone: string;
  url: string;
  number: string;
  search: string;
  textarea: string;
  checkbox: boolean;
  radio: Gender | '';
  toggle: boolean;
  range: number;
  select: Country | '';
  selectOpen: boolean;
  color: string;
  date: string;
  time: string;
  datetime: string;
  month: string;
  week: string;
  stepper: number;
  rating: number;
  tags: string[];
  tagInput: string;
  hidden: string;
};

const INITIAL_FORM: FormData = {
  text: '',
  password: '',
  showPassword: false,
  email: '',
  phone: '',
  url: '',
  number: '',
  search: '',
  textarea: '',
  checkbox: false,
  radio: '',
  toggle: false,
  range: 50,
  select: '',
  selectOpen: false,
  color: '#0000FF',
  date: '',
  time: '',
  datetime: '',
  month: '',
  week: '',
  stepper: 0,
  rating: 0,
  tags: [],
  tagInput: '',
  hidden: 'hidden-value-123',
};

export default function FormScreen() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [rangeWidth, setRangeWidth] = useState(0);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addTag = () => {
    const tag = form.tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      update('tags', [...form.tags, tag]);
    }
    update('tagInput', '');
  };

  const removeTag = (tag: string) => {
    update('tags', form.tags.filter((t) => t !== tag));
  };

  const handleSubmit = () => {
    const output = { ...form, selectOpen: undefined, showPassword: undefined, tagInput: undefined };
    console.log('Form submitted:', JSON.stringify(output, null, 2));
    Alert.alert('Form Submitted', JSON.stringify(output, null, 2));
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>All Form Elements</Text>

        <Field label="Text Input">
          <TextInput style={styles.input} placeholder="type=text" value={form.text} onChangeText={(v) => update('text', v)} />
        </Field>

        <Field label="Password Input">
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="type=password"
              secureTextEntry={!form.showPassword}
              value={form.password}
              onChangeText={(v) => update('password', v)}
            />
            <Button title={form.showPassword ? 'Hide' : 'Show'} onPress={() => update('showPassword', !form.showPassword)} />
          </View>
        </Field>

        <Field label="Email Input">
          <TextInput style={styles.input} placeholder="type=email" keyboardType="email-address" autoCapitalize="none" value={form.email} onChangeText={(v) => update('email', v)} />
        </Field>

        <Field label="Phone Input">
          <TextInput style={styles.input} placeholder="type=tel" keyboardType="phone-pad" value={form.phone} onChangeText={(v) => update('phone', v)} />
        </Field>

        <Field label="URL Input">
          <TextInput style={styles.input} placeholder="type=url" keyboardType="url" autoCapitalize="none" value={form.url} onChangeText={(v) => update('url', v)} />
        </Field>

        <Field label="Number Input">
          <TextInput style={styles.input} placeholder="type=number" keyboardType="numeric" value={form.number} onChangeText={(v) => update('number', v)} />
        </Field>

        <Field label="Search Input">
          <TextInput style={styles.input} placeholder="type=search" keyboardType="web-search" value={form.search} onChangeText={(v) => update('search', v)} />
        </Field>

        <Field label="Textarea">
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="textarea"
            multiline
            textAlignVertical="top"
            value={form.textarea}
            onChangeText={(v) => update('textarea', v)}
          />
        </Field>

        <Field label="Checkbox">
          <Pressable style={styles.row} onPress={() => update('checkbox', !form.checkbox)}>
            <View style={[styles.checkbox, form.checkbox && styles.checkboxChecked]}>
              {form.checkbox && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text>I agree to the terms</Text>
          </Pressable>
        </Field>

        <Field label="Radio Buttons">
          {GENDER_OPTIONS.map((opt) => {
            const selected = form.radio === opt;
            return (
              <Pressable key={opt} style={styles.row} onPress={() => update('radio', opt)}>
                <View style={[styles.radio, selected && styles.radioChecked]}>
                  {selected && <View style={styles.radioInner} />}
                </View>
                <Text>{opt}</Text>
              </Pressable>
            );
          })}
        </Field>

        <Field label="Switch / Toggle">
          <View style={styles.row}>
            <Text>Enable notifications</Text>
            <Switch value={form.toggle} onValueChange={(v) => update('toggle', v)} />
          </View>
        </Field>

        <Field label={`Range Slider (${form.range})`}>
          <Pressable
            onLayout={(e) => setRangeWidth(e.nativeEvent.layout.width)}
            onPress={(e) => {
              const pct = Math.round((e.nativeEvent.locationX / rangeWidth) * 100);
              update('range', Math.max(0, Math.min(100, pct)));
            }}
            style={styles.sliderTrack}>
            <View style={[styles.sliderFill, { width: `${form.range}%` }]} />
            <View style={[styles.sliderThumb, { left: `${form.range}%` }]} />
          </Pressable>
        </Field>

        <Field label="Select / Dropdown">
          <Pressable style={styles.input} onPress={() => update('selectOpen', !form.selectOpen)}>
            <Text style={form.select ? styles.text : styles.placeholder}>
              {form.select || 'Choose a country...'}
            </Text>
          </Pressable>
          {form.selectOpen && (
            <View style={styles.dropdown}>
              {COUNTRY_OPTIONS.map((opt) => (
                <Pressable
                  key={opt}
                  style={styles.dropdownItem}
                  onPress={() => {
                    update('select', opt);
                    update('selectOpen', false);
                  }}>
                  <Text>{opt}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </Field>

        <Field label={`Color Picker (${form.color})`}>
          <View style={styles.colorRow}>
            {COLOR_OPTIONS.map((c) => (
              <Pressable
                key={c}
                onPress={() => update('color', c)}
                style={[styles.colorSwatch, { backgroundColor: c }, form.color === c && styles.colorSelected]}
              />
            ))}
          </View>
        </Field>

        <Field label="Date Input (YYYY-MM-DD)">
          <TextInput style={styles.input} placeholder="2026-10-14" keyboardType="numeric" maxLength={10} value={form.date} onChangeText={(v) => update('date', v)} />
        </Field>

        <Field label="Time Input (HH:MM)">
          <TextInput style={styles.input} placeholder="14:30" keyboardType="numeric" maxLength={5} value={form.time} onChangeText={(v) => update('time', v)} />
        </Field>

        <Field label="DateTime Input (YYYY-MM-DDTHH:MM)">
          <TextInput style={styles.input} placeholder="2026-10-14T14:30" value={form.datetime} onChangeText={(v) => update('datetime', v)} />
        </Field>

        <Field label="Month Input (YYYY-MM)">
          <TextInput style={styles.input} placeholder="2026-10" keyboardType="numeric" maxLength={7} value={form.month} onChangeText={(v) => update('month', v)} />
        </Field>

        <Field label="Week Input (YYYY-Www)">
          <TextInput style={styles.input} placeholder="2026-W42" value={form.week} onChangeText={(v) => update('week', v)} />
        </Field>

        <Field label={`Stepper (${form.stepper})`}>
          <View style={styles.row}>
            <Button title="-" onPress={() => update('stepper', form.stepper - 1)} />
            <Text style={styles.stepperValue}>{form.stepper}</Text>
            <Button title="+" onPress={() => update('stepper', form.stepper + 1)} />
          </View>
        </Field>

        <Field label={`Rating (${form.rating}/5)`}>
          <View style={styles.row}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Pressable key={n} onPress={() => update('rating', n === form.rating ? 0 : n)}>
                <Text style={styles.star}>{n <= form.rating ? '★' : '☆'}</Text>
              </Pressable>
            ))}
          </View>
        </Field>

        <Field label="Tags / Chips Input">
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="type a tag and press Add"
              value={form.tagInput}
              onChangeText={(v) => update('tagInput', v)}
              onSubmitEditing={addTag}
            />
            <Button title="Add" onPress={addTag} />
          </View>
          {form.tags.length > 0 && (
            <View style={styles.tagsRow}>
              {form.tags.map((tag) => (
                <Pressable key={tag} style={styles.tag} onPress={() => removeTag(tag)}>
                  <Text style={styles.tagText}>{tag} ✕</Text>
                </Pressable>
              ))}
            </View>
          )}
        </Field>

        <Field label="Hidden Field (not displayed)">
          <Text style={styles.muted}>hidden = "{form.hidden}"</Text>
        </Field>

        <Field label="Plain Button">
          <Button title="Click me" onPress={() => Alert.alert('Button', 'Plain button clicked')} />
        </Field>

        <View style={styles.buttonRow}>
          <Button title="Submit" onPress={handleSubmit} />
          <Button title="Reset" onPress={handleReset} color="#888" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 16, gap: 12 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  field: { gap: 6 },
  label: { fontSize: 14, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
  },
  textarea: { minHeight: 80, textAlignVertical: 'top' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  text: { color: '#000' },
  placeholder: { color: '#999' },
  muted: { color: '#999', fontSize: 12 },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#999',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: '#3c87f7', borderColor: '#3c87f7' },
  checkmark: { color: '#fff', fontWeight: 'bold' },
  radio: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#999',
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioChecked: { borderColor: '#3c87f7' },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#3c87f7' },
  sliderTrack: { height: 6, backgroundColor: '#ddd', borderRadius: 3, justifyContent: 'center' },
  sliderFill: { height: 6, backgroundColor: '#3c87f7', borderRadius: 3, position: 'absolute', left: 0 },
  sliderThumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3c87f7',
    marginLeft: -10,
  },
  dropdown: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, backgroundColor: '#fff' },
  dropdownItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  colorRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  colorSwatch: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: 'transparent' },
  colorSelected: { borderColor: '#000' },
  stepperValue: { fontSize: 18, fontWeight: 'bold', minWidth: 40, textAlign: 'center' },
  star: { fontSize: 32, color: '#f5a623' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  tag: { backgroundColor: '#3c87f7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  tagText: { color: '#fff', fontSize: 12 },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
});
