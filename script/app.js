(function () {
    const groupUrl = 'https://appleseed-wa.herokuapp.com/api/users/';
    const excurrentTableRowaInfoUrl = 'https://appleseed-wa.herokuapp.com/api/users/'
    let group = JSON.parse(localStorage.getItem('group')) || [];
    const table = document.querySelector('#table-body');
    const tableHead = document.querySelector('#table-head');
    let currentTableRow;
    let rowLength;
    let allEditBtns;
    const searchDiv = document.querySelector('.search');
    const sortDiv = document.querySelector('.sort');
    const animation = document.querySelector('.animation');
    const weaterUrl = 'https://api.openweathermap.org/data/2.5/weather?q='
    const appId = 'd11c6918d8bf5bca750416481fe9bb11'

    if (group.length === 0) {
        getFullGroupInfo();
    } else { printTable(group) }

    //  get full students group information
    async function getFullGroupInfo() {
        animation.style.display = 'block';
        try {
            const groupData = await (await fetch(groupUrl)).json();
            for (let i = 0; i < groupData.length; i++) {
                const basicInfo = groupData[i];
                const excurrentTableRowaInfo = await (await fetch(excurrentTableRowaInfoUrl + `${i}`)).json();
                group.push({ ...basicInfo, ...excurrentTableRowaInfo });
            }

            localStorage.setItem('group', JSON.stringify(group));
            animation.style.display = 'none';
            printTable(group)
        } catch (err) {
            console.log(err);
        }
    }

    // print the main table
    function printTable(group) {
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
        <td class="city">${student.city}</td>
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

    // disabled all other buttons while editing information
    const disableEditBtns = () => {
        allEditBtns = document.querySelectorAll(".update-btn")
        allEditBtns.forEach(button => {
            button.setAttribute('onclick', null);
            button.children[0].classList.add('unavailable-button');
        })
    }

    // enabled all other buttons
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
        printTable(group);
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
        currentTableRow.cells[rowLength - 2].outerHTML = `<td class="update-btn" id="update-${id}" onclick="updateStudent(${id})"><i class="far fa-edit"></i></td>`;
        currentTableRow.cells[rowLength - 1].outerHTML = `<td onclick="deleteStudent(${id})"><i class="far fa-minus-square"></i></td>`;
    }

    // Search & Sort //
    const createSelectInsideTheDiv = (div, selectId) => {
        div.innerHTML +=
            `<select class="select" id="select-${selectId}">
    <option value="firstName">First Name</option>
    <option value="lastName">Last Name</option>
    <option value="capsule">Capsule</option>
    <option value="age">Age</option>
    <option value="city">City</option>
    <option value="gender">Gender</option>
    <option value="hobby">Hobby</option>
    </select>`
    }

    const searchAndDisplayStudents = function (e) {
        const value = (e.target.value).toLowerCase();
        const searchSelected = document.querySelector('#select-search');
        const searchSelectedValue = searchSelected.value
        const tempFilteredGrop = group.filter(student => student[searchSelectedValue].toString().toLowerCase().includes(value));
        printTable(tempFilteredGrop);
    }

    createSelectInsideTheDiv(searchDiv, 'search');
    document.querySelector('#search').addEventListener('input', searchAndDisplayStudents);

    createSelectInsideTheDiv(sortDiv, 'sort');
    const sortSelected = document.querySelector('#select-sort');
    sortSelected.addEventListener('change', e => {
        const value = e.target.value;
        const tempGroup = group.sort((a, b) => a[value].toString().localeCompare(b[value].toString()));
        printTable(tempGroup);
    })

    const cities = document.querySelectorAll(".city");
    for (let i = 0; i < cities.length; i++) {
        cities[i].addEventListener("mouseenter", async () => {
            removeWeaterData();
            const cityName = cities[i].innerHTML;
            const url = weaterUrl + cityName + '&appid=' + appId;
            try {
                const weaterData = await (await fetch(url)).json();
                const cityWeaterTemp = Math.round(weaterData.main.temp - 273.15) + '℃';
                cities[i].setAttribute('data-before', cityWeaterTemp);
            } catch (err) {
                cities[i].setAttribute('data-before', 'Not Avaiable');
            }
        })
        cities[i].addEventListener("mouseleave", () => {
            cities[i].removeAttribute('data-before');
        })
    }

    const removeWeaterData = () => {
        cities.forEach(city => {
            city.removeAttribute('data-before');
        })
    }

})();