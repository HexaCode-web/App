// CustomerServiceChat.js - A real-time customer service chat interface with Voiceflow integration
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Keyboard,
} from "react-native";

import axios from "axios";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { theme, componentStyles } from "../../components/Theme";
import { useSelector } from "react-redux";
import TopBar from "../../components/TopBar";
import SideMenu from "../../components/Menu";

const CustomerServiceChat = ({ userId, navigation }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true); // Start with loading true
  const flatListRef = useRef(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const User = useSelector((state) => state.auth);

  const VOICEFLOW_API_KEY = "VF.DM.685b2c2870fb6c3eafd0f2a9.rmgtUyRN7DqkRfNf";

  // Start the conversation with a bot message when component mounts
  useEffect(() => {
    startConversation();
  }, []);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Function to initialize conversation with Voiceflow
  const startConversation = async () => {
    try {
      const response = await axios.post(
        `https://general-runtime.voiceflow.com/state/user/${userId}/interact?logs=off`,
        {
          action: {
            type: "launch",
          },
          config: {
            tts: false,
            stripSSML: true,
            stopAll: false,
            excludeTypes: ["block", "debug", "flow"],
          },
          state: {
            variables: {
              userName: User?.name || "Customer",
            },
          },
        },
        {
          headers: {
            Authorization: VOICEFLOW_API_KEY,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      const botResponses = response.data.filter((r) => r.type === "text");
      const formattedResponses = botResponses.map((r) => ({
        id: Date.now().toString() + Math.random(),
        sender: "bot",
        text: r.payload.message || "Welcome! How can I help you today?",
        timestamp: new Date(),
      }));

      // If no responses from Voiceflow, add a default welcome message
      if (formattedResponses.length === 0) {
        formattedResponses.push({
          id: Date.now().toString(),
          sender: "bot",
          text: "Welcome! How can I help you today?",
          timestamp: new Date(),
        });
      }

      setMessages(formattedResponses);
    } catch (error) {
      console.error(
        "Error starting conversation:",
        error.response?.data || error
      );
      // Add fallback welcome message in case of error
      setMessages([
        {
          id: Date.now().toString(),
          sender: "bot",
          text: "Hello! I'm your customer service assistant. How can I help you today?",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);
    Keyboard.dismiss();

    try {
      const response = await axios.post(
        `https://general-runtime.voiceflow.com/state/user/${userId}/interact?logs=off`,
        {
          action: {
            type: "text",
            payload: message,
          },
          config: {
            tts: false,
            stripSSML: true,
            stopAll: false,
            excludeTypes: ["block", "debug", "flow"],
          },
          state: {
            variables: {
              x_var: "hello",
            },
          },
        },
        {
          headers: {
            Authorization: VOICEFLOW_API_KEY,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      const botResponses = response.data.filter((r) => r.type === "text");
      const formattedResponses = botResponses.map((r) => ({
        id: Date.now().toString() + Math.random(),
        sender: "bot",
        text: r.payload.message,
        timestamp: new Date(),
      }));

      setMessages((prev) => [...prev, ...formattedResponses]);
    } catch (error) {
      console.error("Error sending message:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }) => {
    const isUser = item.sender === "user";

    return (
      <View
        style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.supportBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isUser ? styles.userText : styles.supportText,
          ]}
        >
          {item.text}
        </Text>
        <Text style={styles.timestamp}>
          {item.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <SideMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
      <TopBar title="الدعم" toggleMenu={toggleMenu} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No messages yet</Text>
              <Text style={styles.emptySubtext}>
                Start a conversation with our customer support team
              </Text>
            </View>
          }
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Type your message..."
            placeholderTextColor={theme.colors.text.secondary}
            multiline
            maxHeight={100}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !message.trim() && styles.sendButtonDisabled,
            ]}
            onPress={sendMessage}
            disabled={!message.trim()}
          >
            <Ionicons
              name="send"
              size={20}
              color={
                message.trim() ? theme.colors.white : theme.colors.text.disabled
              }
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    backgroundColor: theme.colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "android" ? 40 : 10,
    paddingBottom: 10,
    paddingHorizontal: theme.spacing.md,
    ...theme.shadows.md,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    ...componentStyles.header.title,
    textAlign: "left",
  },
  placeholder: {
    width: 24,
  },
  loadingOverlay: {
    position: "absolute",
    right: 20,
    bottom: 80,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 20,
    padding: 8,
    ...theme.shadows.sm,
  },
  messagesContainer: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.xs,
  },
  userBubble: {
    backgroundColor: theme.colors.primary,
    alignSelf: "flex-end",
    borderBottomRightRadius: 0,
  },
  supportBubble: {
    backgroundColor: theme.colors.white,
    alignSelf: "flex-start",
    borderBottomLeftRadius: 0,
  },
  messageText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
  },
  userText: {
    color: theme.colors.white,
  },
  supportText: {
    color: theme.colors.text.primary,
  },
  timestamp: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    alignSelf: "flex-end",
    marginTop: theme.spacing.xs,
    opacity: 0.7,
  },
  inputContainer: {
    flexDirection: "row",
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    ...theme.shadows.sm,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.md,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: theme.spacing.sm,
    ...theme.shadows.xs,
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.border.medium,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "50%",
  },
  emptyText: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.medium,
  },
  emptySubtext: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: "center",
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
  },
});

export default CustomerServiceChat;
