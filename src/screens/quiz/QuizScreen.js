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
import { Ionicons } from "@expo/vector-icons";
import NotLoggedInMessage from "../profile/components/NotLoggedInMessage";
import { getQuiz } from "../../api/quiz/getquiz";
import { get } from "../../utils/localStorage/secureStore";
import { postQuiz } from "../../api/quiz/postquiz";
import QuizAlert from "../../components/Alert/QuizAlert";
import Colors from "../../constants/newColors";
import { useSelector } from "react-redux";

const QuizScreen = () => {
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(600);
  const [sessionId, setSessionId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const darkMode = useSelector((state) => state.darkMode.darkMode); // Redux for dark mode

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
      setAlertMessage(
        response.passed
          ? "تهانينا! لقد نجحت في الاختبار."
          : "للأسف، لم تنجح في الاختبار."
      );
      setShowAlert(true);
    } catch (error) {
      console.error("Quiz submission failed:", error);
    }
  };

  const currentColors = darkMode ? Colors.dark : Colors.light;

  if (!isLoggedIn) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: currentColors.background },
        ]}
      >
        <NotLoggedInMessage />
      </View>
    );
  }

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: currentColors.background },
        ]}
      >
        <ActivityIndicator size="large" color={Colors.highlight} />
      </View>
    );
  }

  if (quizQuestions.length === 0) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: currentColors.background },
        ]}
      >
        <Text style={[styles.optionText, { color: currentColors.optionText }]}>
          No quiz available.
        </Text>
      </View>
    );
  }

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const selectedAnswer = answers[currentQuestion.questionID];

  return (
    <View
      style={[styles.container, { backgroundColor: currentColors.background }]}
    >
      <Text style={[styles.timerText, { color: currentColors.timer }]}>
        ⏳ {formatTime(timeLeft)}
      </Text>
      <Text style={[styles.questionText, { color: currentColors.question }]}>
        {currentQuestion.questionHeader}
      </Text>

      {currentQuestion.shuffledOptions.map((option, index) => {
        const isSelected = selectedAnswer?.questionAnswer === option;
        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              {
                backgroundColor: isSelected
                  ? currentColors.selectedOptionBackground
                  : currentColors.optionBackground,
                borderColor: currentColors.timer,
              },
            ]}
            onPress={() => selectAnswer(option)}
          >
            <Text
              style={[styles.optionText, { color: currentColors.optionText }]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}

      <View style={styles.navigationButtonsContainer}>
        <TouchableOpacity
          style={[
            styles.navButton,
            { backgroundColor: currentColors.navButtonBackground },
            currentQuestionIndex === 0 && { opacity: 0.5 },
          ]}
          onPress={goBack}
          disabled={currentQuestionIndex === 0}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={currentColors.navButtonText}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            { backgroundColor: currentColors.navButtonBackground },
          ]}
          onPress={goNext}
        >
          {currentQuestionIndex === quizQuestions.length - 1 ? (
            <Ionicons
              name="checkmark-done"
              size={24}
              color={currentColors.navButtonText}
            />
          ) : (
            <Ionicons
              name="arrow-forward"
              size={24}
              color={currentColors.navButtonText}
            />
          )}
        </TouchableOpacity>
      </View>

      <Text
        style={[styles.progressText, { color: currentColors.progressText }]}
      >
        {currentQuestionIndex + 1} of {quizQuestions.length}
      </Text>

      <QuizAlert
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
    justifyContent: "center",
    padding: 20,
  },
  timerText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  questionText: {
    fontSize: 22,
    marginBottom: 30,
    textAlign: "center",
  },
  optionButton: {
    padding: 15,
    borderRadius: 12,
    marginVertical: 8,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 18,
    textAlign: "center",
  },
  navigationButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 100,
  },
  navButton: {
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
  },
});
