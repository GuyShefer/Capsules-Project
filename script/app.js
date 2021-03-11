(function () {

    const groupUrl = 'https://appleseed-wa.herokuapp.com/api/users/';
    const excurrentTableRowaInfoUrl = 'https://appleseed-wa.herokuapp.com/api/users/'
    let group = JSON.parse(localStorage.getItem('group')) || [];
    const table = document.querySelector('#table-body');
    let currentTableRow;

    if (group.length === 0) {
        getFullGroupInfo();
    } else { printTable() }

    //  get full group information
    async function getFullGroupInfo() {
        const groupData = await (await fetch(groupUrl)).json();
        for (let i = 0; i < groupData.length; i++) {
            const basicInfo = groupData[i];
            const excurrentTableRowaInfo = await (await fetch(excurrentTableRowaInfoUrl + `${i}`)).json();
            group.push({ ...basicInfo, ...excurrentTableRowaInfo });
        }
        localStorage.setItem('group', JSON.scurrentTableRowingify(group));
        printTable()
    }

    function printTable() {
        table.innerHTML = `<currentTableRow>
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
         </currentTableRow>`;
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
        currentTableRow = (document.querySelector(`#update-${id}`)).parentElement; // up to date info
        const rowLength = currentTableRow.cells.length
        for (let i = 1; i < rowLength; i++) {
            const value = currentTableRow.cells[i].innerHTML;
            currentTableRow.cells[i].innerHTML = `<td><input type="text" name="${value}" id="${id}${value}" value="${value}"></td>`;
        }
        currentTableRow.cells[rowLength - 2].outerHTML = `<td id="confirm-${id}" onclick="confirm()"><i class="far fa-check-circle"></i></td>`;
        currentTableRow.cells[rowLength - 1].outerHTML = `<td onclick="cancel(${id})"><i class="far fa-window-close"></i></td>`;
    }

    confirm = () => {
        // have to save also in the object @#@#$@#$@#$@#$ and save it to the local storage
        const studentId = (currentTableRow.cells[0]).value;
        const rowLength = currentTableRow.cells.length
        for (let i = 1; i < rowLength - 2; i++) {
            const cellValue = (currentTableRow.cells[i].children[0]).value;
            currentTableRow.cells[i].innerHTML = `<td>${cellValue}</td>`
        }
        currentTableRow.cells[rowLength - 2].outerHTML = `<td id="update-${studentId}" onclick="updateStudent(${studentId})"><i class="far fa-edit"></i></td>`
        currentTableRow.cells[rowLength - 1].outerHTML = `<td onclick="deleteStudent(${studentId})"><i class="far fa-minus-square"></i></td>`
    }

    cancel = (id) => {
        // have to take the attributes from the object by the id
        console.log(id);
    }

    deleteStudent = (id) => {
        for (let i = 0; i < group.length; i++) {
            if (group[i].id === id) {
                group.splice(i, 1);
            }
        }
        localStorage.setItem('group', JSON.scurrentTableRowingify(group));
        printTable()
    }



})();