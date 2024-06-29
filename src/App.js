import { useState, useEffect } from "react";
import './App.css';
import {db} from './firebase';
import { collection, getDoc, getDocs, addDoc, doc, deleteDoc, updateDoc} from "firebase/firestore";

function App() {
  const [newName, setNewName] = useState("")
  const [newAge, setNewAge] = useState(0)
  const [newSal, setNewsal] = useState(0)
  const [newDept, setNewDept] = useState("")
  const [id, setId] = useState("")

  const [show, setShow] = useState(false)

  const [users, setUsers] = useState([]);
  const usersCollectionRef = collection(db, "users");

  const createUser = async () => {
    await addDoc(usersCollectionRef, {Name: newName, Age: newAge, Sal: newSal, Dept: newDept});
  };

  const updateUser = async () => {
    const updateData = doc(db,"users",id)
    await updateDoc(updateData, {Name: newName, Age: newAge, Sal: newSal, Dept: newDept});
    setShow(false)
    setNewName("")
    setNewAge(0)
    setNewsal(0)
    setNewDept("")
  };

  const editUser = async (id, name, age, sal, dept) => {
    setNewName(name)
    setNewAge(age)
    setNewsal(sal)
    setNewDept(dept)
    setId(id)
    setShow(true)
  };

  const deleteUser = async (id) => {
    const deleteVal = doc(db, "users", id)
    await deleteDoc(deleteVal)
  };

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({...doc.data(), id: doc.id })));
    };
    getUsers();
  }, []);

  return (
    <div className="App"> 
      <input 
        value={newName}
        placeholder="Name..." 
        onChange={(event) => {
          setNewName(event.target.value);
        }} 
      />
      <input type="number" 
        value={newAge}
        placeholder="Age..."
        onChange={(event) => {
          setNewAge(event.target.value);
        }} 
      />
      <input type="number" 
        value={newSal}
        placeholder="Salary..."
        onChange={(event) => {
          setNewsal(event.target.value);
        }} 
      />
      <input 
        value={newDept}
        placeholder="Department..."
        onChange={(event) => {
          setNewDept(event.target.value);
        }} 
      />
      {!show?<button onClick={createUser}> Create User </button>:
      <button onClick={updateUser}> Update User </button>}

      {users.map((user) => { 
        return (
          <div> 
          <h1>Name: {user.Name}</h1>
          <h1>Age: {user.Age}</h1>
          <button onClick={() => editUser(user.id, user.Name, user.Age, user.Sal, user.Dept)}>Edit</button>
          <button onClick={() => deleteUser(user.id, user.Name, user.Age, user.Sal, user.Dept)}>Delete</button>
          </div>
        );
      })} 
    </div>
  );
}

export default App;
