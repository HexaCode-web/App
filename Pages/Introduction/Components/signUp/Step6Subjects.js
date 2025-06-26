import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import styles from "./SignUpStyles";
import { theme } from "../../../../components/Theme";

const Step6Subjects = ({
  formData,
  toggleArrayValue,
  errors,
  searchQuery,
  setSearchQuery,
  filteredSubjects,
}) => {
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>
        المواد التي تقدم دروس ودورات ضمنها: *
      </Text>
      <Text style={styles.stepSubtitle}>تخصصاتك:</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="ابحث عن المواد..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          textAlign="right"
        />
        <Feather
          name="search"
          size={20}
          color={theme.colors.text.secondary}
          style={styles.searchIcon}
        />
      </View>

      <ScrollView style={styles.subjectsList} nestedScrollEnabled={true}>
        {filteredSubjects.map((subject) => (
          <TouchableOpacity
            key={subject}
            style={styles.subjectOption}
            onPress={() => toggleArrayValue("subjects", subject)}
          >
            <Text style={styles.subjectText}>{subject}</Text>
            <View
              style={[
                styles.subjectIndicator,
                formData.subjects.includes(subject) && styles.subjectSelected,
              ]}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {formData.subjects.length > 0 && (
        <View style={styles.selectedSubjects}>
          <Text style={styles.selectedSubjectsTitle}>
            المواد المحددة ({formData.subjects.length}):
          </Text>
          {formData.subjects.map((subject) => (
            <View key={subject} style={styles.selectedSubjectChip}>
              <Text style={styles.selectedSubjectText}>{subject}</Text>
              <TouchableOpacity
                onPress={() => toggleArrayValue("subjects", subject)}
                style={styles.removeSubjectButton}
              >
                <Feather name="x" size={16} color={theme.colors.white} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {errors.subjects && (
        <Text style={styles.errorText}>{errors.subjects}</Text>
      )}
    </View>
  );
};

export default Step6Subjects;
