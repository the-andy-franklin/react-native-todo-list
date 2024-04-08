import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Alert, SafeAreaView, StatusBar, Platform } from 'react-native';
import axios from 'axios';

interface Task {
    _id: string;
    value: string;
    completed: boolean;
}

const App = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [taskInput, setTaskInput] = useState('');

    const API_URL = Platform.OS === 'android'
        ? 'http://10.0.2.2:8080/tasks'
        : 'http://localhost:8080/tasks';

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const { data } = await axios.get<Task[]>(API_URL);
            setTasks(data);
        } catch (error) {
            console.log(error);
            Alert.alert('Error fetching tasks');
        }
    };

    const addTask = async () => {
        if (!taskInput.trim().length) return;

        try {
            const { data } = await axios.post<Task>(API_URL, { value: taskInput, completed: false });
            setTasks(currentTasks => [...currentTasks, data]);
            setTaskInput('');
        } catch (error) {
            console.log(error);
            Alert.alert('Error adding task');
        }
    };

    const toggleCompletion = async (id: string, completed: boolean) => {
        try {
            await axios.patch(`${API_URL}/${id}`, { completed: !completed });
            fetchTasks();
        } catch (error) {
            console.log(error);
            Alert.alert('Error toggling task completion');
        }
    };

    const deleteTask = async (id: string) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchTasks();
        } catch (error) {
            console.log(error);
            Alert.alert('Error deleting task');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <Text style={styles.title}>Todo List</Text>
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter new task"
                    placeholderTextColor="#888"
                    value={taskInput}
                    onChangeText={setTaskInput}
                />
                <TouchableOpacity onPress={addTask} style={styles.addButton}>
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={tasks}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.taskItem}>
                        <Text style={[styles.taskText, item.completed && styles.taskCompleted]}>{item.value}</Text>
                        <View style={styles.taskActions}>
                            <TouchableOpacity onPress={() => toggleCompletion(item._id, item.completed)} style={styles.actionButton}>
                                <Text style={styles.actionText}>{item.completed ? 'Undo' : 'Done'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => deleteTask(item._id)} style={styles.actionButton}>
                                <Text style={styles.actionText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },
    header: {
        padding: 20,
        backgroundColor: '#6200ee',
    },
    title: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 20,
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        backgroundColor: '#fff',
    },
    addButton: {
        width: 50,
        height: 50,
        backgroundColor: '#6200ee',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: 24,
        color: '#fff',
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    taskText: {
        fontSize: 18,
    },
    taskCompleted: {
        textDecorationLine: 'line-through',
        color: '#aaa',
    },
    taskActions: {
        flexDirection: 'row',
    },
    actionButton: {
        marginLeft: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        backgroundColor: '#6200ee',
    },
    actionText: {
        color: '#fff',
    },
});

export default App;
