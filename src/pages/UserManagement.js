import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc, or } from "firebase/firestore";
import { db } from '../firebase';
import './UserManagement.css';

const UserManagement = () => {
    const [newName, setNewName] = useState('');
    const [newAge, setNewAge] = useState(0);
    const [newDOB, setNewDOB] = useState('');
    const [newSal, setNewSal] = useState(0);
    const [newDept, setNewDept] = useState('');
    const [id, setId] = useState('');
    const [show, setShow] = useState(false);
    const [users, setUsers] = useState([]);
    const usersCollectionRef = collection(db, 'users');

    //   Functions for filters
    const [filterName, setFilterName] = useState('');

    const createUser = async () => {
        await addDoc(usersCollectionRef, { Name: newName, Age: newAge, DOB: newDOB, Sal: newSal, Dept: newDept });
        fetchUsers();
    };

    const updateUser = async () => {
        const updateData = doc(db, 'users', id);
        await updateDoc(updateData, { Name: newName, Age: newAge, DOB: newDOB, Sal: newSal, Dept: newDept });
        setShow(false);
        setNewName('');
        setNewAge(0);
        setNewDOB('');
        setNewSal(0);
        setNewDept('');
        fetchUsers();
    };

    const editUser = async (id, name, age, dob, sal, dept) => {
        setNewName(name);
        setNewAge(age);
        setNewDOB(dob);
        setNewSal(sal);
        setNewDept(dept);
        setId(id);
        setShow(true);
    };

    const deleteUser = async (id) => {
        const deleteVal = doc(db, "users", id);
        await deleteDoc(deleteVal);
        fetchUsers();
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const data = await getDocs(usersCollectionRef);
        setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    //   Filters
    const handleFilterChange = (event) => {
        setFilterName(event.target.value);
    };


    //   Sort
    const sortedUsers = [...users].sort((a, b) => a.Sal - b.Sal);

    const filteredUsers = sortedUsers.filter((user) =>
        user.Name.toLowerCase().includes(filterName.toLowerCase()) ||
        user.Dept.toLowerCase().includes(filterName.toLowerCase())
    );

    return (
        <div className="UserManagement">
            {/* Filter by name and Department */}
            <div id="searchBox">
                <i className="fas fa-search"></i>
                <input
                    type="text"
                    value={filterName}
                    placeholder="Filter by Name or Department..."
                    onChange={handleFilterChange}
                />
            </div>

            <div id="space"></div>

            {/* Create or edit Employee data */}
            <div class="createFields">
                <div class="createFieldRows">
                    <h4>Name</h4>
                    <input
                        value={newName}
                        placeholder="Name..."
                        onChange={(event) => {
                            setNewName(event.target.value);
                        }}
                    />
                </div>
                <div class="createFieldRows">
                    <h4>Age</h4>
                    <input
                        type="number"
                        value={newAge}
                        placeholder="Age..."
                        onChange={(event) => {
                            setNewAge(event.target.value);
                        }}
                    />
                </div>
                <div class="createFieldRows">
                    <h4>Date of Birth</h4>
                    <input
                        type="date"
                        value={newDOB}
                        placeholder="Date of Birth..."
                        onChange={(event) => setNewDOB(event.target.value)}
                    />
                </div>
                <div class="createFieldRows">
                    <h4>Salary</h4>
                    <input
                        type="number"
                        value={newSal}
                        placeholder="Salary..."
                        onChange={(event) => {
                            setNewSal(event.target.value);
                        }}
                    />
                </div>
                <div class="createFieldRows">
                    <h4>Department</h4> 
                    <input
                        value={newDept}
                        placeholder="Department..."
                        onChange={(event) => {
                            setNewDept(event.target.value);
                        }}
                    />
                </div>
            
            {!show ? <button class="createButton" onClick={createUser}> Create User </button> :
                    <button class="createButton" onClick={updateUser}> Update User </button>}
            </div>
            <table id="dataTable">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Date of Birth</th>
                        <th>Salary</th>
                        <th>Department</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user.id}>
                            <td>{user.Name}</td>
                            <td>{user.Age}</td>
                            <td>{user.DOB}</td>
                            <td>{user.Sal}</td>
                            <td>{user.Dept}</td>
                            <td>
                                <button onClick={() => editUser(user.id, user.Name, user.Age, user.DOB, user.Sal, user.Dept)}>Edit</button>
                                <button onClick={() => deleteUser(user.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagement;
