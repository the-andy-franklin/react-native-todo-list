import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Alert, SafeAreaView, StatusBar, Platform } from 'react-native';
import axios from 'axios';
import { Try } from './utils/functions/try';
import { z } from 'zod';

const task_schema = z.object({
    _id: z.string(),
    value: z.string(),
    completed: z.boolean(),
});

type Task = z.infer<typeof task_schema>;

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
        const result = await Try(() => axios.get<unknown>(API_URL)
            .then(response => task_schema.array().parse(response.data)),
        );

        if (result.failure) {
            console.error(result.error);
            Alert.alert('Error fetching tasks');
            return;
        }

        setTasks(result.data);
    };

    const addTask = () => {
        if (!taskInput.trim().length) return;
        setTaskInput('');

        axios.post(API_URL, { value: taskInput })
            .then(fetchTasks)
            .catch(error => {
                console.error(error);
                Alert.alert('Error adding task');
            });
    };

    const toggleCompletion = ({ _id, completed }: Task) => {
        axios.patch(`${API_URL}/${_id}`, { completed: !completed })
            .then(fetchTasks)
            .catch(error => {
                console.error(error);
                Alert.alert('Error toggling task completion');
            });
    };

    const deleteTask = ({ _id }: Task) => {
        axios.delete(`${API_URL}/${_id}`)
            .then(fetchTasks)
            .catch(error => {
                console.error(error);
                Alert.alert('Error deleting task');
            });
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
                            <TouchableOpacity onPress={() => toggleCompletion(item)} style={styles.actionButton}>
                                <Text style={styles.actionText}>{item.completed ? 'Undo' : 'Done'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => deleteTask(item)} style={styles.actionButton}>
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
