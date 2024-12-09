export const getLevelColor = (level) => {
  switch (level) {
    case "Beginner":
      return "green";
    case "Intermediate":
      return "orange";
    case "Advanced":
      return "red";
    default:
      return "gray";
  }
};
