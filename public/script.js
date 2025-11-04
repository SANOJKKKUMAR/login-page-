

 let editedbtn = false;
        const historybtn = document.getElementById('historybtn');
        document.querySelector('form').addEventListener('submit', async(event) => {
 event.preventDefault();
            const amount = document.getElementById('expense-amount').value;
            const description = document.getElementById('expense-description').value;
            const category = document.getElementById('expense-category').value;

         if(editedbtn){
          
               try{
                   // Update request
  let id = editedbtn;
  const response = await fetch(`http://localhost:3000/expense/${id}`, {
      method: 'PUT',   // ✅ change from POST → PUT
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, description, category })
  });
  
    
  editedbtn = false;


    }
    catch(err){
        console.log("during update eror ",err);
    }
}
     else{
            try{
               let userID = localStorage.getItem('userId');
               console.log(userID);
                const response = await fetch('http://localhost:3000/expense', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ amount, description, category , userID})
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                console.log(data);
                 await display(data);
                console.log('Success:', data);
                editedbtn = true;
                event.target.reset();
            } catch (error) {
                console.error('Error:', error);
            }
        }
          
        });





historybtn.addEventListener('click', async() => {

    try {
        const id = localStorage.getItem("userId");
        console.log(id);
        const response = await fetch(`http://localhost:3000/expenses/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        display(data);
        console.log('Success:', data);
    } catch (error) {
        console.error('Error:', error);
    }
});


function showname(){
    const h2 = document.querySelector('h2');
    let username = localStorage.getItem('username');

// agar username exist karta hai
if (username) {
  // pehla letter capital + baaki same
  username = username.charAt(0).toUpperCase() + username.slice(1);

  // h2 me set karna
  h2.textContent = `Welcome, ${username}`;
}
}
showname();


 async function deleteExpense(id) {
     console.log('Deleting expense with ID:', id);
    try{
       

   await  fetch(`http://localhost:3000/expense/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        console.log('Expense deleted:', data);
        // expense list ko refresh karna
        historybtn.click();
    })
    .catch(error => {
        console.error('Error deleting expense:', error);
    });
}
catch(error){
    console.error('Error in deleteExpense function:', error);
}
}

  async function editExpense(id) {
   
 console.log('edited expense with ID:', id);
 const updatebtn = document.getElementById('updatebtn');
 updatebtn.textContent = 'Update Expense';
    try{
     let res =  await  fetch(`http://localhost:3000/expense/${id}`);
        let data = await res.json();
        document.getElementById("expense-amount").value = data.amount;
        document.getElementById("expense-description").value = data.description;
        document.getElementById("expense-category").value = data.category;
        console.log(data);
        editedbtn = id;
        deleteExpense(id);


}
catch(error){
    console.error('Error in editExpense function:', error);
  }
}



let logout = document.getElementById("logoutbtn");
logout.addEventListener("click",(e)=>{
    window.location.replace("index.html");

})


        function display(data) {
            console.log("display called")
    const expenseData = document.getElementById('ull');
    if (!expenseData) return; 
    expenseData.innerHTML = '';
    const arr = Array.isArray(data) ? data : [data];

    arr.forEach(ex => {
        const li = document.createElement('li');
        li.classList.add('expense-item');
        li.innerHTML = `Amount: ${ex.amount}, Description: ${ex.description}, Category: ${ex.category},  <button onclick="deleteExpense('${ex.expenseID}')">Delete</button>
         <button onclick="editExpense('${ex.expenseID}')">Edit</button>`;
        expenseData.appendChild(li);
    });

    
}

