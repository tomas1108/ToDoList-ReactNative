import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Thêm icon delete

const Task = ({ text, completed, onPress, onDelete }) => {
  return (
    <View style={styles.item}>
      <TouchableOpacity style={styles.itemLeft} onPress={onPress}>
        <View style={[styles.square, completed && styles.completedSquare]}></View>
        <Text style={[styles.itemText, completed && styles.completedText]}>{text}</Text>
      </TouchableOpacity>
      <View style={styles.rightSection}>
        {/* Nút xóa */}
        <TouchableOpacity onPress={onDelete}>
          <MaterialIcons name="delete" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '300px'
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  square: {
    width: 24,
    height: 24,
    backgroundColor: '#55BCF6',
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
  },
  completedSquare: {
    opacity: 1,
    backgroundColor: '#4CAF50', // Thay đổi màu khi hoàn thành
  },
  itemText: {
    maxWidth: '80%',
  },
  completedText: {
    textDecorationLine: 'line-through', // Gạch ngang khi hoàn thành
    color: '#bbb',
  },
  circular: {
    width: 12,
    height: 12,
    borderColor: '#55BCF6',
    borderWidth: 2,
    borderRadius: 5,
  },
  completedCircular: {
    borderColor: '#4CAF50', // Thay đổi màu viền khi hoàn thành
  },
  rightSection: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Task;