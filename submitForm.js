let submit = document.getElementById('submit')
console.log(submit)
const formName = 'educationalConsultation'
console.log('form: ' + formName)
let newForm = {}

let printForm = document.getElementById('printToPDF')
printForm.style.display = 'none'

newForm.concerns = []

document.getElementById('submit').addEventListener("click", (event) => {
  newForm.date = document.querySelector('input#date').value
  newForm.staffEmail = document.querySelector('input#staffEmail').value
  newForm.clientName = document.querySelector('input#clientName').value
  newForm.start = document.querySelector('input#start').value
  newForm.stop = document.querySelector('input#stop').value
  newForm.membersPresent = document.querySelector('input#membersPresent').value
  newForm.location = document.querySelector('input#location').value
  for (let i = 1; i < 4; i++) {
    console.log(i)
    if (document.querySelector(`input#concern${i}`).value != null) {
      newForm.concerns[i] = {
        'concern': document.querySelector(`input#concern${i}`).value,
        'resolutions': document.getElementById(`resolution${i}`).value,
        'nextSteps': document.getElementById(`nextSteps${i}`).value
      }
    } else { i = 4 }
  }
  newForm.staffName = document.querySelector('input#staffName').value 
  newForm.recordDate = document.querySelector('input#finalDate').value
  newForm.notes = document.getElementById('notes').value
  newForm.followUps = document.getElementById('followUps').value
  submitForm(newForm, formName)
})


document.getElementById('submit').addEventListener("click", async (event) => {
  submitForm(newForm, formName)
})

async function submitForm(data, form) {
  const document = {
    'form': form,
    'data': data
  }
  console.log(document)
  fetch('https://pffm.azurewebsites.net/form', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin" : "*"
    },
    body: JSON.stringify(document)
  })
    .then(response => response.json())
    .then(data => respond(data)) 
    .catch((err) => showError(err))
}

function respond(data) {
  let id = data.key
  if (id) {
    showSuccess(id)
    sendNotification(id, newForm.clientName, 'individual', 'not urgent')
    sendNotification(id, newForm.staffName, 'individual', 'not urgent')
    sendNotification(id, 'admin', 'individual','not urgent')
  } else {
    showError(data.error)
  }
}

function showSuccess(id) {
  document.getElementById('returnMessage').innerHTML = 'Form has been successfully submitted'
  printForm.style.display = 'inline';
  printForm.addEventListener('click', (e) => {
    location.href = `https://phoenix-freedom-foundation-backend.webflow.io/completed-forms/educational-consultation?id=${id}`
  })
}

function showError(err) {
    console.error
    document.getElementById('returnMessage').innerHTML = `An error occurred when submitting this form, which was ${err}. Please contact the administrator for help.`
}

async function sendNotification(id, recipient, type, priority) {
  let message = `You have a new <br/><a href=phoenix-freedom-foundation-backend.webflow.io/completed-forms/educational-consultation?id=${id}>Educational Consultation Summary</a>`
  console.log(message)
  const url = 'https://pffm.azurewebsites.net/notices'
  let notification = {
    'name': recipient,
    'notice': message,
    'type': type,
    'priority': priority
  }
  const header = {
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin" : "*"
  }
  
  fetch(url, {
    method: "POST",
    headers: header,
    body: JSON.stringify(notification)
  })
    .then(() => console.log('notice sent'))
    .catch(console.error)
}
 
function clearForm() {
  newForm = {}
  document.querySelector('input#clientName').value = '';
  document.querySelector('input#employeeName').value = '';
  for (let i = 1; i < 4; i++) {
    document.getElementById(`date${i}`).innerHTML = ''
    document.getElementById(`min${i}`).innerHTML = ''
    document.getElementById(`goal${i}`).innerHTML = ''
    document.getElementById(`hour${i}`).innerHTML = ''
    document.getElementById(`serviceSummary${i}`).innerHTML = ''
  }
}

