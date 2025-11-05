import axios, { formToJSON } from "axios";

const URL = "http://localhost:5000";

/*----------------- Habits call From Backend------------------ */

export async function getHabits() {
  //http://localhost:3000/habits
  const response = await axios.get(`${URL}/habits`);

  if (response.status === 200) {
    return response.data;
  } else {
    return;
  }
}

export async function getHabit(id) {
  //http://localhost:3000/habits/123345
  const response = await axios.get(`${URL}/habits/${id}`);

  //const for the habit data response from backend with database
  const habit = response.data;

  //here we call also the Image ID from our backend throw MandoDB by
  // getImage() function, which get the image from aws
  // after calling the habit by it Id.
  const data = await getImage(habit.imageId);
  habit.image = data;
  return habit;
}

/* this old version function is used to create a habit, it will call the backend
export async function createHabit(habit) {

    // in this route we create the habit details first and it also has
    // to create the image, creating the image with aws, the aws will provide us
    // an ID image that we will wend to our MangoDB becuz in MangoDB we can uplode
    // only text, so the Id text will be save there with habitRoutes.jsx 
    // put and post habit imageId, so this function will call for createImage() function.
    
    
    const data = await createImage(habit.file)
    console.log("Image upload response:", data);
    
    const imageId = habit.file.name

    habit.imageId = imageId


    //http://localhost:3000/habits/123345
    const response = await axios.post(`${URL}/habits`, habit)
    return response
}*/

export async function createHabit(habit) {
  try {
    // Create the image first and get the imageId from response
    //console.log("Uploading image...") // Debug log
    const imageResponse = await createImage(habit.file);
    //console.log("Image response:", imageResponse.data) // Debug log

    const imageId = imageResponse.data.imageId; // Get imageId from response
    //console.log("ImageId:", imageId) // Debug log

    // Set the imageId in the habit object
    habit.imageId = imageId;

    // Remove the file from habit object before sending to MongoDB
    //delete habit.file

    //console.log("Creating habit with imageId:", habit.imageId) // Debug log

    //http://localhost:3000/habits/123345
    const response = await axios.post(`${URL}/habits`, habit);
    return response;
  } catch (error) {
    console.error("Error in createHabit:", error);
    throw error;
  }
}

export async function updateHabit(id, habit) {
  //http://localhost:3000/habits/123345
  const response = await axios.put(`${URL}/habits/${id}`, habit);
  return response;
}

export async function deleteHabit(id) {
  //http://localhost:3000/habits/123345
  const response = await axios.delete(`${URL}/habits/${id}`);
  return response;
}

/*----------------- Users call From Backend------------------ */

export async function getUser(id) {
  //http://localhost:3000/users/123345
  const response = await axios.get(`${URL}/users/${id}`);

  if (response.status === 200) {
    return response.data;
  } else {
    return;
  }
}

export async function createUser(user) {
  //http://localhost:3000/users/123345
  const response = await axios.post(`${URL}/users`, user);
  return response;
}

export async function updateUser(id, user) {
  //http://localhost:3000/users/123345
  const response = await axios.put(`${URL}/users/${id}`, user);
  return response;
}

export async function verifyUser(user) {
  //http://localhost:3000/users/login
  const response = await axios.post(`${URL}/users/login`, user);
  if (response.data.success) {
    return response.data.token;
  } else {
    return;
  }
}

/*-------------- --- Images call From Backend------------------ */
/* old version of createImage function, it will call the backend
export async function createImage(file) {
    const formData = new FormData()
    formData.append("image", file);
    const response = await axios.post(`${URL}/images`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',        }
    })
    return response
}*/

export async function createImage(file) {
  try {
    const formData = new FormData();
    formData.append("image", file); // Make sure this matches what your backend expects

    //console.log("Sending image to backend...") // Debug log

    const response = await axios.post(`${URL}/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    //console.log("Backend response:", response.data) // Debug log
    return response;
  } catch (error) {
    console.error("Error in createImage:", error);
    throw error;
  }
}

export async function getImage(id) {
  const response = await axios.get(`${URL}/images/${id}`);
  return response.data;
}
