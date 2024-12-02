import React, { useState, useEffect } from "react";
import { View, Text, Button, TextInput, FlatList, StyleSheet } from "react-native";
import { auth, db } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { collection, addDoc, getDocs } from "firebase/firestore"; // Các phương thức Firestore

export default function HomeScreen({ navigation }) {
  const [newTodo, setNewTodo] = useState(""); // State để lưu input của người dùng
  const [todos, setTodos] = useState([]); // State để lưu danh sách To-Do từ Firestore

  // Đăng xuất
  const handleLogout = () => {
    signOut(auth).then(() => navigation.navigate("Login"));
  };

  // Thêm To-Do mới vào Firestore
  const handleAddTodo = async () => {
    if (newTodo.trim() === "") return; // Kiểm tra nếu input trống

    try {
      const user = auth.currentUser; // Lấy thông tin người dùng hiện tại
      if (user) {
        // Thêm To-Do mới vào Firestore trong collection của người dùng
        await addDoc(collection(db, "users", user.uid, "todos"), {
          task: newTodo,
          createdAt: new Date(), // Thêm thời gian tạo để sắp xếp
        });
        setNewTodo(""); // Xóa input sau khi thêm thành công
        fetchTodos(user.uid); // Lấy lại danh sách To-Do của người dùng
      }
    } catch (error) {
      alert("Error adding todo: ", error.message);
    }
  };

  // Lấy danh sách To-Do của người dùng từ Firestore
  const fetchTodos = async (uid) => {
    try {
      const querySnapshot = await getDocs(collection(db, "users", uid, "todos"));
      const todoList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTodos(todoList); // Cập nhật danh sách todos
    } catch (error) {
      alert("Error fetching todos: ", error.message);
    }
  };

  // Fetch dữ liệu khi trang được tải
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      fetchTodos(user.uid); // Lấy danh sách To-Do của người dùng
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text>Welcome to Home Screen!</Text>
      <Button title="Logout" onPress={handleLogout} />
      
      {/* Input thêm To-Do */}
      <TextInput
        placeholder="Enter your To-Do"
        value={newTodo}
        onChangeText={setNewTodo}
        style={styles.input}
      />
      <Button title="Add Todo" onPress={handleAddTodo} />

      {/* Hiển thị danh sách To-Do */}
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <Text>{item.task}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  input: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 20,
    padding: 10,
  },
  todoItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    width: "100%",
  },
});
