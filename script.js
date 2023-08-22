var rosters = [];

    loadRosterData();

    function loadRosterData() {
      var rosterData = localStorage.getItem("rosters");
      if (rosterData) {
        rosters = JSON.parse(rosterData);
        var rosterList = document.getElementById("rosters");
        rosterList.innerHTML = ""; // Clear existing roster list
        rosters.forEach(function (roster, index) {
          addRoster(roster, index + 1);
        });
      }
    }

    function addRoster(existingRoster, rosterIndex) {
      var rosterList = document.getElementById("rosters");
      var newRoster = document.createElement("div");
      var newRosterIndex = rosterList.querySelectorAll(".roster").length + 1;

      newRoster.classList.add("roster");
      newRoster.innerHTML = `
        <h2>Roster ${newRosterIndex}</h2>
        <button onclick="addChild(this.parentNode)">Add Child</button>
        <button onclick="removeRoster(this.parentNode)">Remove Roster</button>
        <ul class="child-list">
          ${existingRoster ? populateExistingChildren(existingRoster.children) : ""}
        </ul>
      `;

      rosterList.appendChild(newRoster);
    }

function populateExistingChildren(children) {
  var childListHTML = "";
  children.forEach(function (child) {
    var guardianEmail1 = child.guardians && child.guardians.length > 0 ? child.guardians[0].email : "";
    var guardianEmail2 = child.guardians && child.guardians.length > 1 ? child.guardians[1].email : "";

    childListHTML += `
      <li class="child">
        <input type="text" placeholder="First Name" value="${child.firstName}">
        <input type="text" placeholder="Last Name" value="${child.lastName}">
        <input type="text" placeholder="Grade" value="${child.grade}">
        <input type="text" placeholder="Room Number" value="${child.roomNumber}">
        <input type="text" placeholder="Days Attending" value="${child.daysAttending}">
        <input type="text" placeholder="Time Leaving" value="${child.timeLeaving}">
        <input type="text" placeholder="Parent Signature" value="${child.parentSignature}">
        <input type="text" placeholder="Guardian Email 1" value="${guardianEmail1}">
        <input type="text" placeholder="Guardian Email 2" value="${guardianEmail2}">
        <div class="attendance">
          <select>
            <option value="present" ${child.attendance === 'present' ? 'selected' : ''}>Present</option>
            <option value="absent" ${child.attendance === 'absent' ? 'selected' : ''}>Absent</option>
            <option value="excused" ${child.attendance === 'excused' ? 'selected' : ''}>Excused</option>
          </select>
        </div>
        <button onclick="removeRoster(this.parentNode)">Remove</button>
      </li>
    `;
  });
  return childListHTML;
}

function addChild(roster) {
  var childList = roster.querySelector(".child-list");
  var newChild = document.createElement("li");
  newChild.classList.add("child");
  newChild.innerHTML = `
    <input type="text" placeholder="First Name">
    <input type="text" placeholder="Last Name">
    <input type="text" placeholder="Grade">
    <input type="text" placeholder="Room Number">
    <input type="text" placeholder="Days Attending">
    <input type="text" placeholder="Time Leaving">
    <input type="text" placeholder="Parent Signature">
    <input type="text" placeholder="Guardian Email 1">
    <input type="text" placeholder="Guardian Email 2">
    <div class="attendance">
      <select>
        <option value="present">Present</option>
        <option value="absent">Absent</option>
        <option value="excused">Excused</option>
      </select>
    </div>
    <button onclick="removeRoster(this.parentNode)">Remove</button>
  `;
  childList.appendChild(newChild);
  saveRosterData(); // Save the roster data after adding the child
}

function removeChild(child) {
  var childItem = child.parentNode;
  childItem.removeChild(childItem);
  saveRosterData(); // Save the roster data after removing the child
  console.log("hello")
}

    function deleteGuardian(guardian) {
      var guardiansList = guardian.parentNode;
      guardiansList.removeChild(guardian);
    }

    function removeRoster(roster) {
      var rosterList = roster.parentNode;
      rosterList.removeChild(roster);
    }

    window.onbeforeunload = function () {
      saveRosterData();
    };

    function saveRosterData() {
  var rosterList = document.getElementById("rosters");
  var rosters = rosterList.querySelectorAll(".roster");
  var rosterData = [];
  rosters.forEach(function (roster) {
    var children = roster.querySelectorAll(".child");
    var rosterChildren = [];
    children.forEach(function (child) {
      var firstName = child.querySelector("input:nth-of-type(1)").value;
      var lastName = child.querySelector("input:nth-of-type(2)").value;
      var grade = child.querySelector("input:nth-of-type(3)").value;
      var roomNumber = child.querySelector("input:nth-of-type(4)").value;
      var daysAttending = child.querySelector("input:nth-of-type(5)").value;
      var timeLeaving = child.querySelector("input:nth-of-type(6)").value;
      var parentSignature = child.querySelector("input:nth-of-type(7)").value;
      var guardianEmail1 = child.querySelector("input:nth-of-type(8)").value;
      var guardianEmail2 = child.querySelector("input:nth-of-type(9)").value;
      var guardians = [];
      if (guardianEmail1 !== "") {
        guardians.push({ email: guardianEmail1 });
      }
      if (guardianEmail2 !== "") {
        guardians.push({ email: guardianEmail2 });
      }
      var attendance = child.querySelector(".attendance select").value;

      rosterChildren.push({
        firstName: firstName,
        lastName: lastName,
        grade: grade,
        roomNumber: roomNumber,
        daysAttending: daysAttending,
        timeLeaving: timeLeaving,
        parentSignature: parentSignature,
        guardians: guardians,
        attendance: attendance,
      });
    });
    rosterData.push({ children: rosterChildren });
  });
  localStorage.setItem("rosters", JSON.stringify(rosterData));
}

// const canvas = document.getElementById('drawing-board');
// const ctx = canvas.getContext('2d');

// const canvasOffsetX = canvas.offsetLeft;
// const canvasOffsetY = canvas.offsetTop;

// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

// let isPainting = false;
// let lineWidth = 1;
// let startX;
// let startY;

// const draw = (e) => {
//   if (!isPainting) {
//     return;
//   }

//   ctx.lineWidth = lineWidth;
//   ctx.lineCap = 'round';

//   ctx.lineTo(e.clientX - canvasOffsetX, e.clientY);
//   ctx.stroke();
// }

// canvas.addEventListener('mousedown', (e) => {
//   isPainting = true;
//   startX = e.clientX;
//   startY = e.clientY;
// });

// canvas.addEventListener('mouseup', e => {
//   isPainting = false;
//   ctx.stroke();
//   ctx.beginPath();
// });

// canvas.addEventListener('mousemove', draw);

// document.getElementById("contactForm").addEventListener("submit", function(event) {
//   event.preventDefault(); // Prevent the default form submit action

//   // Get the user's email input
//   var userEmail = document.getElementById("guardian").value;

//   // Update the form action URL with the user's email
//   this.action = "https://formsubmit.co/" + userEmail;

//   // Submit the form
//   this.submit();
// });
