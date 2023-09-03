var rosters = [];

window.addEventListener("DOMContentLoaded", function() {
  loadRosterData();
});

function loadRosterData() {
  var rosterData = localStorage.getItem("rosters");
  if (rosterData) {
    rosters = JSON.parse(rosterData);
    var rosterList = document.getElementById("rosters");
    rosterList.innerHTML = "";

    rosters.forEach(function(roster, index) {
      addRoster(roster, index + 1);
      var rosterChildren = roster.children;
      var childElements = rosterList.querySelectorAll(".child");
      rosterChildren.forEach(function(child, childIndex) {
        var childElement = childElements[childIndex];
        var imgElement = childElement.querySelector(".child-photo");
        imgElement.src = child.imgData;

        if (child.imgWidth && child.imgHeight) {
          imgElement.style.width = child.imgWidth + "px";
          imgElement.style.height = child.imgHeight + "px";
        }
      });
    });
  }
}

function addRoster(existingRoster, rosterIndex) {
  var rosterList = document.getElementById("rosters");
  var newRoster = document.createElement("div");
  var newRosterIndex = rosterIndex;
  var rosterIndexNum = rosterList.querySelectorAll(".roster").length + 1

  newRoster.classList.add("roster");
  newRoster.innerHTML = `
    <h2>Roster ${rosterIndexNum}</h2>
    <button class="add-button" onclick="addChild(this.parentNode)">Add Child</button>
      <button class="remove-roster-button" onclick="removeRoster(this.parentNode)">Remove Roster</button>
            <button class="submit-roster-button" onclick="submitRoster(this.parentNode)">Submit Roster</button>
    <ul class="child-list">
      ${existingRoster ? populateExistingChildren(existingRoster.children) : ""}
    </ul>
  `;

  rosterList.appendChild(newRoster);

  const tableDataDiv = document.createElement("div");
  tableDataDiv.className = ("table_data");

  const table = document.createElement("table");
  console.log(rosterIndexNum)
  const tableId = `attendance-table-${rosterIndexNum}`;
  table.id = tableId;
  console.log(tableId)

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  const headers = [
    "First Name", "Last Name", "Grade", "Room Number",
    "Days Attending", "Time Leaving", "Parent Signature",
    "Guardian Email 1", "Guardian Email 2", "Emergency Phone",
    "Attendance"
  ];

  headers.forEach(headerText => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);

  const tbody = document.createElement("tbody");

  table.appendChild(thead);
  table.appendChild(tbody);

  tableDataDiv.appendChild(table);

  newRoster.appendChild(tableDataDiv);

  newRoster.addEventListener("click", function(event) {
    if (event.target.nodeName != "BUTTON") {
      if (event.target.nodeName != "INPUT") {
        if (event.target.nodeName != "SELECT") {
          var clickedRosterIndex = rosterIndexNum;

          var childInputs = newRoster.querySelectorAll(".child-list");

          // Toggle the hidden-inputs class on child inputs
          childInputs.forEach(input => {
            input.classList.toggle("hidden-inputs");
          });

          var tableContainer = document.querySelector(`#attendance-table-${clickedRosterIndex}`);

          console.log(tableContainer.style.display)

          var childInputs = newRoster.querySelectorAll(".child input:not(:first-child)");
          var childSelects = newRoster.querySelectorAll(".child select");

          var childInputsArray = [];
          var childAttendanceValues = [];
          var childElements = newRoster.querySelectorAll(".child-list");

          childInputs.forEach(function(input) {
            childInputsArray.push(input.value);
          });

          childSelects.forEach(function(select) {
            childAttendanceValues.push(select.value);
          });

          var tableContainer = document.querySelector(`#attendance-table-${clickedRosterIndex}`);
          // Toggle the display of the table
          if (tableContainer.style.display == "block") {
            console.log("test")
            tableContainer.style.display = "none";
            console.log(tableContainer.style.display)
          } else {
            tableContainer.style.display = "block";
          }

          var tableBody = tableContainer.querySelector("tbody");
          tableBody.innerHTML = "";

          var students = [];
          var childInputsArrayLength = childInputsArray.length / 10;

          for (let i = 0; i < childInputsArrayLength; i++) {
            students.push({
              firstName: childInputsArray[i * 10],
              lastName: childInputsArray[(i * 10) + 1],
              grade: childInputsArray[(i * 10) + 2],
              room: childInputsArray[(i * 10) + 3],
              days: childInputsArray[(i * 10) + 4],
              timeLeaving: childInputsArray[(i * 10) + 5],
              parentSignature: childInputsArray[(i * 10) + 6],
              parentEmail1: childInputsArray[(i * 10) + 7],
              parentEmail2: childInputsArray[(i * 10) + 8],
              phone: childInputsArray[(i * 10) + 9],
              attendance: childAttendanceValues[i],
            });
          }

          students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${student.firstName}</td>
              <td>${student.lastName}</td>
              <td>${student.grade}</td>
              <td>${student.room}</td>
              <td>${student.days}</td>
              <td>${student.timeLeaving}</td>
              <td>${student.parentSignature}</td>
              <td>${student.parentEmail1}</td>
              <td>${student.parentEmail2}</td>
              <td>${student.phone}</td>
              <td>${student.attendance}</td>
            `;
            tableBody.appendChild(row);
          });
        }
      }
    }
  });
}

function populateExistingChildren(children) {
  var childListHTML = "";
  children.forEach(function(child) {
    var guardianEmail1 = child.guardians && child.guardians.length > 0 ? child.guardians[0].email : "";
    var guardianEmail2 = child.guardians && child.guardians.length > 1 ? child.guardians[1].email : "";

    childListHTML += `
      <li class="child">
        <input type="file" accept="image/*" onchange="uploadPhoto(this)">
        <img class="child-photo" src="${child.imgData || ''}" alt="" style="display: none;">
        <input type="text" placeholder="First Name" value="${child.firstName}">
        <input type="text" placeholder="Last Name" value="${child.lastName}">
        <input type="text" placeholder="Grade" value="${child.grade}">
        <input type="text" placeholder="Room Number" value="${child.roomNumber}">
        <input type="text" placeholder="Days Attending" value="${child.daysAttending}">
        <input type="text" placeholder="Time Leaving" value="${child.timeLeaving}">
        <input type="text" placeholder="Parent Signature" value="${child.parentSignature}">
        <input type="text"class="guardian" placeholder="Guardian Email 1" value="${guardianEmail1}">
        <input type="text" class="guardian" placeholder="Guardian Email 2" value="${guardianEmail2}">
        <input type="text" placeholder="Emergency Phone Number" value="${child.EmergencyPhoneNumber}">
        <div class="attendance">
          <select>
            <option value="present" ${child.attendance === 'present' ? 'selected' : ''}>Present</option>
            <option value="absent" ${child.attendance === 'absent' ? 'selected' : ''}>Absent</option>
            <option value="excused" ${child.attendance === 'excused' ? 'selected' : ''}>Excused</option>
          </select>
        </div>
        <button class="remove-button" onclick="removeRoster(this.parentNode)">Remove</button>
      </li>
    `;

    // Set the image size
    if (child.imgWidth && child.imgHeight) {
      var img = new Image();
      img.src = child.imgData || '';
      img.onload = function() {
        var width = child.imgWidth;
        var height = child.imgHeight;
        img.style.width = width + "px";
        img.style.height = height + "px";
      };
    }
  });
  return childListHTML;
}

function addChild(roster) {
  var childList = roster.querySelector(".child-list");
  var newChild = document.createElement("li");
  newChild.classList.add("child");
  newChild.innerHTML = `
    <input type="file" accept="image/*" onchange="uploadPhoto(this)">
    <img class="child-photo" src="" alt="" style="display: none;">
    <input type="text" placeholder="First Name">
    <input type="text" placeholder="Last Name">
    <input type="text" placeholder="Grade">
    <input type="text" placeholder="Room Number">
    <input type="text" placeholder="Days Attending">
    <input type="text" placeholder="Time Leaving">
    <input type="text" placeholder="Parent Signature">
    <input type="text" class="guardian" placeholder="Guardian Email 1">
    <input type="text" class="guardian" placeholder="Guardian Email 2">
    <input type="text" placeholder="Emergency Phone Number">
    <div class="attendance">
      <select>
        <option value="present">Present</option>
        <option value="absent">Absent</option>
        <option value="excused">Excused</option>
      </select>
    </div>
    <button class="remove-button" onclick="removeRoster(this.parentNode)">Remove</button>
  `;
  // Place the child element with image at the top
  childList.insertBefore(newChild, childList.firstChild);
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

window.onbeforeunload = function() {
  saveRosterData();
};

function saveRosterData() {
  var rosterList = document.getElementById("rosters");
  var rosters = rosterList.querySelectorAll(".roster");
  var rosterData = [];
  rosters.forEach(function(roster) {
    var children = roster.querySelectorAll(".child");
    var rosterChildren = [];
    children.forEach(function(child) {
      var imgElement = child.querySelector(".child-photo");
      var imgData = imgElement.src; // Save image data
      var imgWidth = parseInt(imgElement.style.width) || 0;  // Store the width
      var imgHeight = parseInt(imgElement.style.height) || 0; // Store the height
      var firstName = child.querySelector("input:nth-of-type(2)").value;
      console.log(firstName)
      var lastName = child.querySelector("input:nth-of-type(3)").value;
      var grade = child.querySelector("input:nth-of-type(4)").value;
      var roomNumber = child.querySelector("input:nth-of-type(5)").value;
      var daysAttending = child.querySelector("input:nth-of-type(6)").value;
      var timeLeaving = child.querySelector("input:nth-of-type(7)").value;
      var parentSignature = child.querySelector("input:nth-of-type(8)").value;
      var guardianEmail1 = child.querySelector("input:nth-of-type(9)").value;
      var guardianEmail2 = child.querySelector("input:nth-of-type(10)").value;
      var guardians = [];
      if (guardianEmail1 !== "") {
        guardians.push({ email: guardianEmail1 });
      }
      if (guardianEmail2 !== "") {
        guardians.push({ email: guardianEmail2 });
      }
      var EmergencyPhoneNumber = child.querySelector("input:nth-of-type(11)").value;
      var attendance = child.querySelector(".attendance select").value;

      rosterChildren.push({
        imgData: imgElement.src,
        imgWidth: imgWidth,     // Store image width
        imgHeight: imgHeight,   // Store image height
        firstName: firstName,
        lastName: lastName,
        grade: grade,
        roomNumber: roomNumber,
        daysAttending: daysAttending,
        timeLeaving: timeLeaving,
        parentSignature: parentSignature,
        guardians: guardians,
        EmergencyPhoneNumber: EmergencyPhoneNumber,
        attendance: attendance,
      });
    });
    rosterData.push({ children: rosterChildren });
  });
  localStorage.setItem("rosters", JSON.stringify(rosterData));
}

function uploadPhoto(input) {
  var file = input.files[0];
  var childPhoto = input.parentNode.querySelector(".child-photo");
  var reader = new FileReader();

  reader.onload = function(event) {
    var img = new Image();
    img.src = event.target.result;

    img.onload = function() {
      var maxWidth = 200;
      var maxHeight = 200;
      var width = img.width;
      var height = img.height;

      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width *= maxHeight / height;
        height = maxHeight;
      }

      childPhoto.src = img.src;
      childPhoto.style.width = width + "px";
      childPhoto.style.height = height + "px";

      // Show the image preview
      childPhoto.style.display = "block";

      // Save image data and dimensions
      saveRosterData();
    };
  };

  if (file) {
    reader.readAsDataURL(file);
  } else {
    // Hide the image preview when no image is selected
    childPhoto.style.display = "none";
  }
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

function submitRoster(roster) {
  var guardianEmailInputs = roster.querySelectorAll("input:nth-of-type(9)");

  //Loop through each guardian input and send a separate form submission
  guardianEmailInputs.forEach(function(input) {
    var userEmail = input.value.trim();

    // Skip empty email inputs
    if (userEmail !== "") {
      // Get the associated child's attendance
      var attendanceSelect = input.closest(".child").querySelector(".attendance select");
      var firstName = input.closest(".child").querySelector("input:nth-of-type(2)").value;
      var attendance = attendanceSelect.value;

      // Build the attendance message
      var message = `${firstName} was ${attendance} in class today.`;

      // Create a form submission for each email
      var form = document.createElement("form");
      form.method = "POST";
      form.action = "https://formsubmit.co/" + userEmail;
      form.target = "_blank"; // Open the submission in a new tab

      // Add a hidden input field to include the attendance message
      var messageInput = document.createElement("input");
      messageInput.type = "hidden";
      messageInput.name = "Attendance";
      messageInput.value = message;

      form.appendChild(messageInput);

      // Submit the form
      document.body.appendChild(form);
      form.submit();

      // Remove the form after submission
      document.body.removeChild(form);
    }
  });
}

// Get a reference to the audio element
var audio = document.getElementById("backgroundMusic");

// Set the volume (0.5 for 50% volume)
audio.volume = 0.015;
