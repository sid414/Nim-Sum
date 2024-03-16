var nArray; // store max stack lengths
var rArray; // store current stack lengths
var bYourMove; // 1 for player, 0 for computer
var bAutoPlay; // if 1 computer responds immediately, otherwise


var makeMove = "       Make your move!!";
var timerID;
var bFinished;

function TimerResponse() {
  timerID = window.setTimeout("TimerResponse()", 1000);
  // form = document.form[0];
  form = frames["game"].lastChild.previousElementSibling;
  c = makeMove.substring(0, 1);
  s = makeMove.substring(1, makeMove.length);
  makeMove = s + c;
  form.Greetings.value = makeMove;
}

function StopTimer() {
  clearTimeout(timerID);
}

function DecimalToBinary(N) {
  s = "";
  A = N;

  while (A >= 2) {
    B = A % 2;
    A = Math.floor(A / 2);
    s += B;
  }

  s += A;

  return Transpose(s);
}

// function Transpose(s)
//
// return a string written backwards
//
function Transpose(s) {
  N = s.length;
  t = "";

  for (i = 0; i < N; i++) t = t + s.substring(N - i - 1, N - i);

  s = t;

  return s;
}

// function Help()

//

function Help() {
  var frame = frames["game"];
  //var form = frame.document.forms[0];

  frames["game"].lastChild.previousElementSibling.children[2].value =
    DecimalToBinary(rArray[1]);

  frames["game"].lastChild.previousElementSibling.children[3].value =
    DecimalToBinary(rArray[2]);
  frames["game"].lastChild.previousElementSibling.children[4].value =
    DecimalToBinary(rArray[3]);

  //   form.hint1.value = DecimalToBinary(rArray[1]);
  //   form.hint2.value = DecimalToBinary(rArray[2]);
  //   form.hint3.value = DecimalToBinary(rArray[3]);
}

// function ClearHint()
//
function ClearHint() {
  var frame = frames["game"];
  //var form = frame.document.forms[0];

  //form.hint1.value = "";
  frames["game"].lastChild.previousElementSibling.children[2].value = "";

  frames["game"].lastChild.previousElementSibling.children[3].value = "";
  frames["game"].lastChild.previousElementSibling.children[4].value = "";
  //   form.hint2.value = "";
  //   form.hint3.value = "";
}

// function Random(n)
//
// returns a random integer modulo n
//

function Random(n) {
  today = new Date();

  if (n > 1) {
    m = today.getTime() % n;
    return m == 0 ? 1 : m;
  } else return 1;
}

// function MakeArray(N)
//
// standard JavaScript's
//

function MakeArray(N) {
  this.length = N;
  return this;
}

// function MakeMove()
//
// computer makes move
//
function MakeMove() {
  var frame = frames["game"];
  //var form = frame.document.forms[0];
  var form = frames["game"].lastChild.previousElementSibling;

  if (bYourMove) {
    //form.Greetings.value = "It's your move. Not mine.";
    frames[
      "game"
    ].lastChild.previousElementSibling.children[5].children[0].value =
      "It's your move. Not mine.";
    return;
  }

  bYourMove = 1;

  X = rArray[1] ^ rArray[2] ^ rArray[3];

  if (X == 0) {
    MakeRandomMove(form);
    return;
  }

  row = SelectRow(X & rArray[1], X & rArray[2], X & rArray[3]);

  if (row == 0) Remove(form, row, rArray[1] - (rArray[2] ^ rArray[3]));
  else if (row == 1) Remove(form, row, rArray[2] - (rArray[1] ^ rArray[3]));
  else if (row == 2) Remove(form, row, rArray[3] - (rArray[1] ^ rArray[2]));

  CheckFinished(0);
}

// function MakeRandomMove(form)
//
function MakeRandomMove(form) {
  row = 0;

  while (row < 3)
    if (rArray[row + 1] == 0) ++row;
    else break;

  // the test is superflious:
  // the heap could not
  // possibly be empty
  //
  if (rArray[row + 1] != 0) {
    num = Random(rArray[row + 1]);
    if (num == 0) num = 1;
    Remove(form, row, num);
  } else {
    frames[
      "game"
    ].lastChild.previousElementSibling.children[5].children[0].value =
      "I give up. You won!!!";
    //form.Greetings.value = "I give up. You won!!!";
  }
}

// function SelectRow(a, b, c)
//
// actually selects the maximum of the three arguments
// and returns it's ordinal among the three starting with 0
//

function SelectRow(a, b, c) {
  A = a;
  N = 0;

  if (b > A) {
    A = b;
    N = 1;
  }

  if (c > A) N = 2;

  return N;
}

// function Remove(form, row, a)
//
// removes a checks from row row
//
function Remove(form, row, a) {
  for (i = 1; i <= a; i++)
    form.elements[rArray[row + 1] + row * nArray - i].checked = 0;

  rArray[row + 1] -= a;
}

// function UnCheck()

//

function UnCheck() {
  var frame = frames["game"];
  //var form = frame.document.forms[0];
  var form = frames["game"].lastChild.previousElementSibling;

  ClearHint();

  for (row = 0; row < 3; row++)
    if (ScrewedUp(form, row, rArray[row + 1])) return;

  if (bYourMove) {
    //form.Greetings.value = "";
    frames[
      "game"
    ].lastChild.previousElementSibling.children[5].children[0].value = "";
    bYourMove = 0;
  } else {
    //form.Greetings.value = "Hey. It's my move.";
    frames[
      "game"
    ].lastChild.previousElementSibling.children[5].children[0].value =
      "Hey. It's my move.";
    return;
  }

  for (j = 0; j < 3; j++) if (UnCheckRow(form, j) == 1) break;

  X = rArray[1] ^ rArray[2] ^ rArray[3];

  if (X == 0)
    frames[
      "game"
    ].lastChild.previousElementSibling.children[5].children[0].value =
      "Wow. It was a good move.";
  else
    frames[
      "game"
    ].lastChild.previousElementSibling.children[5].children[0].value =
      "Phew. I am sure you could do better.";

  CheckFinished(1);

  if (bAutoPlay && bFinished != 1)
    //    if (bAutoPlay)
    MakeMove();
}

function CheckFinished(human) {
  var frame = frames["game"];
  //var form = frame.document.forms[0];

  if (rArray[1] == 0 && rArray[2] == 0 && rArray[3] == 0) {
    frames[
      "game"
    ].lastChild.previousElementSibling.children[5].children[0].value = human
      ? "You won!! "
      : "I won!!!";
    //  form.Greetings.value = human ? "You won!!!" : "I won!!!";
    bFinished = 1;
  }
}

// function UnCheckRow(form, row)
//
// Checks if the click occurred in the given row.
// Unchecks the boxes to the right of the clicked one
//

function UnCheckRow(form, row) {
  found = 0;
  N = rArray[row + 1];

  for (i = 0; i < N; i++)
    if (found == 0) {
      if (!form.elements[i + row * nArray].checked) {
        found = 1;
        rArray[row + 1] = i;
      }
    } else form.elements[i + row * nArray].checked = 0;

  return found;
}

function ScrewedUp(form, row, N) {
  for (i = N; i < nArray; i++)
    if (form.elements[i + row * nArray].checked) {
      form.elements[i + row * nArray].checked = 0;

      return 1;
    }

  return 0;
}

// function SetArray()
//
// creates 3d array of max checkbox numbers
//

function SetArray() {
  rArray = new MakeArray(3);

  StartNewGame();
}

// function StartNewGame()
//

function StartNewGame() {
  var frame = frames["game"];
  var form = frames["game"].lastChild.previousElementSibling;
  frames[
    "game"
  ].lastChild.previousElementSibling.children[5].children[0].value =
    "Let's start!!!";
  //form.Greetings.value = "Let's start!!!";

  CheckBoxes(form);
  ClearHint();

  bFinished = 0;
  bYourMove = 1;
}

// function CheckBoxes(form)
//
// fills checkbox stacks randomly
//

function CheckBoxes(form) {
  rArray[1] = Random(17) + 4;
  rArray[2] = Random(27) - 6;

  if (rArray[2] < 2) rArray[2] = 7;

  rArray[3] = Random(37) - 16;

  if (rArray[3] < 2) rArray[3] = 8;

  for (j = 1; j <= 3; j++)
    for (i = 0; i < nArray; i++) {
      if (i < rArray[j]) form.elements[i + (j - 1) * nArray].checked = 1;
      else form.elements[i + (j - 1) * nArray].checked = 0;
    }
}
function CreateGame() {
  var nArray = 21; // Move these variable declarations inside the function
  var frame = document.getElementById("game");

  if (!frame) {
    return;
  }

  var form = document.getElementById("gameForm");

  if (!form) {
    return;
  }

  var table = document.createElement("table");
  table.setAttribute("border", "1");
  table.setAttribute("id", "nimTable");

  for (var j = 1; j <= 3; j++) {
    var row = document.createElement("tr");

    for (var i = 1; i <= nArray; i++) {
      var cell = document.createElement("td");
      var checkbox = document.createElement("input");
      checkbox.setAttribute("type", "checkbox");
      checkbox.setAttribute("name", i + "_" + j);
      checkbox.setAttribute("value", "");
      cell.appendChild(checkbox);
      row.appendChild(cell);
    }

    table.appendChild(row);
  }

  form.appendChild(table);
}