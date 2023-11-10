export async function getUser() {
  try {
    return { name: "John Doe", username: "johndoe"}
  } catch (err) {
    return err;
  }
}