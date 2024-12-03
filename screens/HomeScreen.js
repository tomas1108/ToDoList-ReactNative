import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Platform,
  Button,
  TextInput,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { auth, db } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import Task from "../components/Task";

export default function HomeScreen({ navigation }) {
  const [newTodo, setNewTodo] = useState(""); // State để lưu input của người dùng
  const [todos, setTodos] = useState([]); // State để lưu danh sách To-Do từ Firestore
  const [editingTodoId, setEditingTodoId] = useState(null); // State để lưu ID của To-Do đang được chỉnh sửa

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
          completed: false, // Chưa hoàn thành
          createdAt: new Date(),
        });
        setNewTodo(""); // Xóa input sau khi thêm thành công
        fetchTodos(user.uid); // Lấy lại danh sách To-Do của người dùng
      }
    } catch (error) {
      alert("Error adding todo: " + error.message);
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
      alert("Error fetching todos: " + error.message);
    }
  };

  // Đánh dấu To-Do là đã hoàn thành
  const handleToggleComplete = async (todoId, completed) => {
    try {
      const user = auth.currentUser;
      if (user) {
        // Cập nhật trạng thái "completed" trong Firestore
        const todoRef = doc(db, "users", user.uid, "todos", todoId);
        await updateDoc(todoRef, {
          completed: !completed, // Lật trạng thái
        });
        fetchTodos(user.uid); // Lấy lại danh sách To-Do đã cập nhật
      }
    } catch (error) {
      alert("Error updating todo: " + error.message);
    }
  };

  // Xóa To-Do khỏi Firestore
  const handleDeleteTodo = async (todoId) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const todoRef = doc(db, "users", user.uid, "todos", todoId);
        await deleteDoc(todoRef); // Xóa To-Do khỏi Firestore
        fetchTodos(user.uid); // Lấy lại danh sách To-Do đã cập nhật
      }
    } catch (error) {
      alert("Error deleting todo: " + error.message);
    }
  };

  // Sửa To-Do
  const handleEditTodo = async () => {
    if (newTodo.trim() === "") return; // Kiểm tra nếu input trống

    try {
      const user = auth.currentUser;
      if (user && editingTodoId) {
        // Cập nhật To-Do trong Firestore
        const todoRef = doc(db, "users", user.uid, "todos", editingTodoId);
        await updateDoc(todoRef, {
          task: newTodo, // Cập nhật nội dung
        });
        setEditingTodoId(null); // Reset trạng thái sửa
        setNewTodo(""); // Xóa input sau khi sửa thành công
        fetchTodos(user.uid); // Lấy lại danh sách To-Do đã cập nhật
      }
    } catch (error) {
      alert("Error editing todo: " + error.message);
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
      <Text style={styles.title}>Today's Tasks</Text>
      <View style={styles.logoutWrapper}>
        <Button style={styles.bt_log} title="Logout" onPress={handleLogout} />
      </View>

      {/* Hiển thị danh sách To-Do */}
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Task
            text={item.task}
            completed={item.completed}
            onPress={() => handleToggleComplete(item.id, item.completed)}
            onDelete={() => handleDeleteTodo(item.id)} // Pass delete handler
            onEdit={() => {
              setEditingTodoId(item.id); // Set id for editing
              setNewTodo(item.task); // Fill input with current task
            }}
          />
        )}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.writeTaskWrapper}
      >
        <TextInput
          style={styles.input}
          placeholder={editingTodoId ? "Edit your task" : "Write a task"}
          value={newTodo}
          onChangeText={setNewTodo}
        />
        <TouchableOpacity onPress={editingTodoId ? handleEditTodo : handleAddTodo}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>{editingTodoId ? "Save" : "+"}</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
 
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
    borderRadius: 60,
    borderColor: "#C0C0C0",
    borderWidth: 1,
    width: 250,
  },
  tasksWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  writeTaskWrapper: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#C0C0C0",
    borderWidth: 1,
  },
  addText: {},

  bt_log: {
    backgroundColor: "#FF0000",
    padding: 10,
    borderRadius: 5,
  },

  // Đặt vị trí button logout ở góc trên cùng bên trái
  logoutWrapper: {
    position: "absolute",
    top: 20,
    left: 20,
  },
});