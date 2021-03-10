(function () {

    const groupUrl = 'https://appleseed-wa.herokuapp.com/api/users/';
    const extraInfoUrl = 'https://appleseed-wa.herokuapp.com/api/users/'
    let group = JSON.parse(localStorage.getItem('group')) || [];

    if (group.length === 0) {
        getFullGroupInfo();
    } else { console.log(group) }

    //  get full group information
    async function getFullGroupInfo() {
        const groupData = await (await fetch(groupUrl)).json();
        for (let i = 0; i < groupData.length; i++) {
            const basicInfo = groupData[i];
            const extraInfo = await (await fetch(extraInfoUrl + `${i}`)).json();
            group.push({ ...basicInfo, ...extraInfo });
        }
        console.log(group);
        localStorage.setItem('group', JSON.stringify(group));
    }

    


})();