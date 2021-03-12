(function () {

    const groupUrl = 'https://appleseed-wa.herokuapp.com/api/users/';
    const excurrentTableRowaInfoUrl = 'https://appleseed-wa.herokuapp.com/api/users/'
    let group = JSON.parse(localStorage.getItem('group')) || [];
    const table = document.querySelector('#table-body');
    const tableHead = document.querySelector('#table-head');
    let currentTableRow;
    let rowLength;
    let allEditBtns;

    if (group.length === 0) {
        getFullGroupInfo();
    } else { printTable() }

    //  get full students group information
    async function getFullGroupInfo() {
        const groupData = await (await fetch(groupUrl)).json();
        for (let i = 0; i < groupData.length; i++) {
            const basicInfo = groupData[i];
            const excurrentTableRowaInfo = await (await fetch(excurrentTableRowaInfoUrl + `${i}`)).json();
            group.push({ ...basicInfo, ...excurrentTableRowaInfo });
        }
        localStorage.setItem('group', JSON.stringify(group));
        printTable()
    }

    function printTable() {
        tableHead.innerHTML = `<tr class="table-head">
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
        table.innerHTML = '';
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
        <td class="update-btn" id="update-${student.id}" onclick="updateStudent(${student.id})"><i class="far fa-edit"></i></td>
        <td onclick="deleteStudent(${student.id})"><i class="far fa-minus-square"></i></td>`
        })
    }

    updateStudent = (id) => {
        currentTableRow = (document.querySelector(`#update-${id}`)).parentElement;
        rowLength = currentTableRow.cells.length;
        for (let i = 1; i < rowLength - 2; i++) {
            const value = currentTableRow.cells[i].innerHTML;
            currentTableRow.cells[i].innerHTML = `<td><input class="input" type="text" name="${value}" id="${id}${value}" value="${value}"></td>`;
        }
        currentTableRow.cells[rowLength - 2].outerHTML = `<td id="confirm-${id}" onclick="confirm(${id})"><i class="far fa-check-circle"></i></td>`;
        currentTableRow.cells[rowLength - 1].outerHTML = `<td onclick="cancel(${id})"><i class="far fa-window-close"></i></td>`;
        disableEditBtns();
    }


    const disableEditBtns = () => {
        allEditBtns = document.querySelectorAll(".update-btn")
        allEditBtns.forEach(button => {
            button.setAttribute('onclick', null);
            button.children[0].classList.add('unavailable-button');
        })
    }

    const enableEditBtns = () => {
        allEditBtns = document.querySelectorAll(".update-btn");
        allEditBtns.forEach(button => {
            const studentId = button.getAttribute('id').split('update-').pop();
            button.setAttribute('onclick', `updateStudent(${studentId})`);
            button.children[0].classList.remove('unavailable-button');
        })
    }

    deleteStudent = (id) => {
        for (let i = 0; i < group.length; i++) {
            if (group[i].id === id) {
                group.splice(i, 1);
            }
        }
        localStorage.setItem('group', JSON.stringify(group));
        printTable();
    }

    confirm = (id) => {
        for (let i = 1; i < rowLength - 2; i++) {
            const cellValue = (currentTableRow.cells[i].children[0]).value;
            currentTableRow.cells[i].innerHTML = `<td>${cellValue}</td>`;
            let key = Object.keys(group[id])[i];
            group[id][key] = cellValue;
        }
        setUpdateAndDeleteBtns(id);
        enableEditBtns();
        localStorage.setItem('group', JSON.stringify(group));
    }

    cancel = (id) => {
        const student = group.find(student => student.id === id);
        for (let i = 1; i < rowLength - 2; i++) {
            currentTableRow.cells[i].innerHTML = `<td>${Object.values(student)[i]}</td>`
        }
        enableEditBtns();
        setUpdateAndDeleteBtns(id);
    }

    const setUpdateAndDeleteBtns = (id) => {
        currentTableRow.cells[rowLength - 2].outerHTML = `<td id="update-${id}" onclick="updateStudent(${id})"><i class="far fa-edit"></i></td>`;
        currentTableRow.cells[rowLength - 1].outerHTML = `<td onclick="deleteStudent(${id})"><i class="far fa-minus-square"></i></td>`;
    }

})();