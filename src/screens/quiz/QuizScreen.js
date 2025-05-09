import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import NotLoggedInMessage from "../profile/components/NotLoggedInMessage";
import { getQuiz } from "../../api/quiz/getquiz";
import { get } from "../../utils/localStorage/secureStore";
import { postQuiz } from "../../api/quiz/postquiz";
import CustomAlert from "../../components/Alert/CustomAlert";

const QuizScreen = () => {
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [sessionId, setSessionId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Shuffle helper
  const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await get("userToken");
      setIsLoggedIn(!!token);
    };
    checkLogin();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchQuiz = async () => {
      try {
        const data = await getQuiz();
        const shuffledQuestions = data.questions.map((q) => ({
          ...q,
          shuffledOptions: shuffleArray(q.options),
        }));
        setQuizQuestions(shuffledQuestions);
        setSessionId(data.quizSessionID);
        console.log("Quiz data:", data);
      } catch (error) {
        console.error("Quiz fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [isLoggedIn]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const selectAnswer = (option) => {
    const question = quizQuestions[currentQuestionIndex];
    setAnswers((prev) => ({
      ...prev,
      [question.questionID]: {
        questionHeader: question.questionHeader,
        questionAnswer: option,
      },
    }));
  };

  const goNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishQuiz();
    }
  };

  const goBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const finishQuiz = async () => {
    const formattedAnswers = Object.values(answers);

    try {
      const response = await postQuiz(sessionId, formattedAnswers);
      setAlertMessage(response.message);
      setShowAlert(true);
    } catch (error) {
      console.error("Quiz submission failed:", error);
    }
  };

    if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <NotLoggedInMessage />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#F4A950" />
      </View>
    );
  }


  if (quizQuestions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.optionText}>No quiz available.</Text>
      </View>
    );
  }

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const selectedAnswer = answers[currentQuestion.questionID];

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>⏳ {formatTime(timeLeft)}</Text>
      <Text style={styles.questionText}>{currentQuestion.questionHeader}</Text>

      {currentQuestion.shuffledOptions.map((option, index) => {
        const isSelected = selectedAnswer?.questionAnswer === option;
        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              isSelected && styles.selectedOptionButton,
            ]}
            onPress={() => selectAnswer(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        );
      })}

      <View style={styles.navigationButtonsContainer}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentQuestionIndex === 0 && { opacity: 0.5 },
          ]}
          onPress={goBack}
          disabled={currentQuestionIndex === 0}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={goNext}>
          {currentQuestionIndex === quizQuestions.length - 1 ? (
            <Ionicons name="checkmark-done" size={24} color="#000" />
          ) : (
            <Ionicons name="arrow-forward" size={24} color="#000" />
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.progressText}>
        {currentQuestionIndex + 1} of {quizQuestions.length}
      </Text>
      
      {/* Custom Alert */}
      <CustomAlert
        visible={showAlert}
        onClose={() => {
          setShowAlert(false);
          navigation.goBack();
        }}
        message={alertMessage}
      />
    </View>
  );
};

export default QuizScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    padding: 20,
  },
  timerText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
    color: "#F4A950",
  },
  questionText: {
    fontSize: 22,
    marginBottom: 30,
    textAlign: "center",
    color: "#ffffff",
  },
  optionButton: {
    backgroundColor: "#1C1C1E",
    padding: 15,
    borderRadius: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#F4A950",
  },
  selectedOptionButton: {
    backgroundColor: "#F4A950",
    borderColor: "#ffffff",
  },
  optionText: {
    fontSize: 18,
    textAlign: "center",
    color: "#ffffff",
  },
  navigationButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 100,
  },
  navButton: {
    backgroundColor: "#F4A950",
    padding: 10,
    borderRadius: 10,
    flex: 0.44,
    alignItems: "center",
    justifyContent: "center",
  },
  progressText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
    color: "#F4A950",
  },
});
