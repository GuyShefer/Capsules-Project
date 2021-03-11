(function () {

    const groupUrl = 'https://appleseed-wa.herokuapp.com/api/users/';
    const extraInfoUrl = 'https://appleseed-wa.herokuapp.com/api/users/'
    let group = JSON.parse(localStorage.getItem('group')) || [];
    const table = document.querySelector('#table-body');

    if (group.length === 0) {
        getFullGroupInfo();
    } else { printTable() }

    //  get full group information
    async function getFullGroupInfo() {
        const groupData = await (await fetch(groupUrl)).json();
        for (let i = 0; i < groupData.length; i++) {
            const basicInfo = groupData[i];
            const extraInfo = await (await fetch(extraInfoUrl + `${i}`)).json();
            group.push({ ...basicInfo, ...extraInfo });
        }
        localStorage.setItem('group', JSON.stringify(group));
        printTable()
    }

    function printTable() {
        table.innerHTML = `<tr>
        <th>Id</th>
        <th>FirstName</th>
        <th>LastName</th>
        <th>Capsule</th>
        <th>Age</th>
        <th>City</th>
        <th>Gender</th>
        <th>Hobby</th>
        <th>Button</th>
        <th>Button</th>
         </tr>`;
        group.forEach(student => {
            table.innerHTML +=
                `<td>${student.id}</td>
                <td>${student.firstName}</td>
        <td>${student.lastName}</td>
        <td>${student.capsule}</td>
        <td>${student.age}</td>
        <td>${student.city}</td>
        <td>${student.gender}</td>
        <td>${student.hobby}</td>
        <td id="update-${student.id}" onclick="updateStudent(${student.id})"><i class="far fa-edit"></i></td>
        <td onclick="deleteStudent(${student.id})"><i class="far fa-minus-square"></i></td>`
        })
    }

    updateStudent = (id) => {
        console.log(id);
        const td = document.querySelector(`#update-${id}`);
        console.log(td.parentElement);
        // have to change the buttons from edit, delete => confirm,cancel.
        // have to make the tr elements to field input.
        // have to make a confirm function.

    }

    deleteStudent = (id) => {
        for (let i = 0; i < group.length; i++) {
            if(group[i].id === id){
                group.splice(i, 1);
            }
        }
        localStorage.setItem('group', JSON.stringify(group));
        printTable()
    }



})();