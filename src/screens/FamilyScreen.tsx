import React, { useEffect, useState } from 'react';
import { View, Alert } from 'react-native';
import { Text, Surface, Button, TextInput, IconButton, Divider } from 'react-native-paper';
import { Kid, listKids, createKid, updateKid, deleteKid } from '../lib/kids';

export default function FamilyScreen() {
	const [kids, setKids] = useState<Kid[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [name, setName] = useState('');
	const [age, setAge] = useState('');
	const [editingId, setEditingId] = useState<string | null>(null);

	const refresh = async () => {
		setLoading(true);
		try {
			const data = await listKids();
			setKids(data);
		} catch (e: any) {
			Alert.alert('Error', e.message ?? 'Failed to load kids');
		}
		setLoading(false);
	};

	useEffect(() => {
		refresh();
	}, []);

	const onSubmit = async () => {
		try {
			if (!name || !age) return Alert.alert('Missing fields', 'Name and age are required');
			const ageNum = Number(age);
			if (Number.isNaN(ageNum) || ageNum < 0) return Alert.alert('Invalid age', 'Enter a valid age');
			if (editingId) {
				await updateKid(editingId, { name, age: ageNum });
			} else {
				await createKid(name, ageNum);
			}
			setName('');
			setAge('');
			setEditingId(null);
			refresh();
		} catch (e: any) {
			Alert.alert('Error', e.message ?? 'Unable to save');
		}
	};

	const startEdit = (kid: Kid) => {
		setEditingId(kid.id);
		setName(kid.name);
		setAge(String(kid.age));
	};

	const remove = async (id: string) => {
		try {
			await deleteKid(id);
			refresh();
		} catch (e: any) {
			Alert.alert('Error', e.message ?? 'Unable to delete');
		}
	};

	return (
		<View style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 24, gap: 16 }}>
			<Text variant="headlineMedium">Your Family</Text>

			<Surface elevation={1} style={{ padding: 16, borderRadius: 12, gap: 12 }}>
				<Text variant="titleMedium">Add or Edit Child</Text>
				<TextInput label="Name" value={name} onChangeText={setName} />
				<TextInput label="Age" keyboardType="number-pad" value={age} onChangeText={setAge} />
				<Button mode="contained" onPress={onSubmit} disabled={kids.length >= 3 && !editingId}>
					{editingId ? 'Update Child' : 'Add Child'}
				</Button>
				{kids.length >= 3 && !editingId ? (
					<Text style={{ color: 'gray' }}>Maximum of 3 children reached.</Text>
				) : null}
			</Surface>

			<Surface elevation={1} style={{ padding: 8, borderRadius: 12 }}>
				{loading ? (
					<Text>Loading...</Text>
				) : kids.length === 0 ? (
					<Text>No children added yet.</Text>
				) : (
					kids.map((kid, idx) => (
						<React.Fragment key={kid.id}>
							<View
								style={{
									paddingHorizontal: 8,
									paddingVertical: 10,
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'space-between',
									minHeight: 56,
								}}
							>
								<View style={{ flex: 1, gap: 2 }}>
									<Text variant="titleSmall">{kid.name}</Text>
									<Text>Age: {kid.age}</Text>
								</View>
								<View style={{ flexDirection: 'row', width: 92, alignItems: 'center', justifyContent: 'flex-end' }}>
									<IconButton icon="pencil" size={18} style={{ margin: 0 }} onPress={() => startEdit(kid)} />
									<IconButton icon="delete" size={18} style={{ margin: 0 }} onPress={() => remove(kid.id)} />
								</View>
							</View>
							{idx < kids.length - 1 ? <Divider /> : null}
						</React.Fragment>
					))
				)}
			</Surface>
		</View>
	);
}


