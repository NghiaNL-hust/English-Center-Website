const Student = require("../models/student");
const Account = require("../models/account");
const Lecturer = require("../models/lecturer");
const Course = require("../models/course");

// import format date
const { format, parseISO } = require("date-fns");

//---------------- ADMIN CONTROLLER ---------------
exports.getIndex = async (req, res, next) => {
  students = await Student.getAllStudents();

  // format date of birth
  for (const student of students) {
    student.dob = format(student.dob, "yyyy-MM-dd");
  }

  res.render("admin/index", {
    isLogged: req.session.user ? true : false,
    account: req.session.user,
    students: students,
    pageTitle: "Dashboard",
    path: "/admin",
  });
};

//------------- STUDENT CONTROLLER --------------
exports.getStudents = async (req, res, next) => {
  students = await Student.getAllStudents();

  // format date of birth
  for (const student of students) {
    student.dob = format(student.dob, "yyyy-MM-dd");
  }

  res.render("admin/students", {
    isLogged: req.session.user ? true : false,
    account: req.session.user,
    students: students,
    pageTitle: "Students",
    path: "/admin/students",
  });
};

exports.getAddStudent = (req, res, next) => {
  res.render("admin/add-student", {
    isLogged: req.session.user ? true : false,
    account: req.session.user,
    pageTitle: "Add Student",
    path: "/admin/add-student",
    formsCSS: true,
    productCSS: true,
    activeAddStudent: true,
  });
};

exports.postAddStudent = async (req, res, next) => {
  let student_id = null;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const phone = req.body.phone;
  const address = req.body.address;

  // check if avatar is uploaded
  let avatar = null;
  try {
    avatar = req.file.filename;
  } catch {}

  const email = req.body.email;
  const dob = req.body.dob;

  const username = req.body.username;
  const password = req.body.password;

  const student = new Student(
    student_id,
    first_name,
    last_name,
    phone,
    address,
    avatar,
    email,
    dob
  );
  // add student
  const addStudentStatus = await Student.addStudent(student);

  // add account
  student_id = addStudentStatus[0].insertId;
  const account = new Account(username, password, 2, null, null, student_id);
  Account.addAccount(account);
  res.redirect("/admin/students");
};

exports.getStudent = async (req, res, next) => {
  try {
    const student_id = req.params.student_id;
    let student = await Student.getStudentById(student_id);
    // format date of birth
    student.dob = format(student.dob, "yyyy-MM-dd");

    const student_account = await Account.getAccountById(student_id);
    res.render("admin/student-detail", {
      isLogged: req.session.user ? true : false,
      account: req.session.user,
      student: student,
      student_account: student_account,
      pageTitle: "Student Detail",
      path: "/admin/students/" + student_id,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/admin");
  }
};

// update student
exports.postStudent = (req, res, next) => {
  const student_id = req.params.student_id;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const phone = req.body.phone;
  const address = req.body.address;

  // check if avatar is uploaded
  let avatar = null;
  try {
    avatar = req.file.filename;
  } catch {
    avatar = req.body.avatar ? req.body.avatar : null;
  }

  const email = req.body.email;
  const dob = req.body.dob;

  const username = req.body.username;
  const password = req.body.password;

  // update student
  const student = new Student(
    student_id,
    first_name,
    last_name,
    phone,
    address,
    avatar,
    email,
    dob
  );

  Student.updateStudent(student);

  // update account
  const account = new Account(username, password, 2, null, null, student_id);
  Account.updateAccount(account);
  res.redirect("/admin/students");
};

exports.deleteStudent = (req, res, next) => {
  const student_id = req.params.student_id;
  Student.deleteStudent(student_id);
  Account.deleteAccount(student_id);
  res.redirect("/admin/students");
};
//---------------- END ----------------

// ------------- LETURER CONTROLLER -------------
// get lecturers
exports.getLecturers = async (req, res, next) => {
  const lecturers = await Lecturer.getAllLecturers();

  // format date of birth
  for (const lecturer of lecturers) {
    lecturer.dob = format(lecturer.dob, "yyyy-MM-dd");
  }

  res.render("admin/lecturers", {
    isLogged: req.session.user ? true : false,
    account: req.session.user,
    lecturers: lecturers,
    pageTitle: "Lecturers",
    path: "/admin/lecturers",
  });
};

// get add lecturer page
exports.getAddLecturer = (req, res, next) => {
  res.render("admin/add-lecturer", {
    isLogged: req.session.user ? true : false,
    account: req.session.user,
    pageTitle: "Add Lecturer",
    path: "/admin/add-lecturer",
    formsCSS: true,
    productCSS: true,
    activeAddLecturer: true,
  });
};

// get lecturer detail
exports.getLecturer = async (req, res, next) => {
  try {
    const lecturer_id = req.params.lecturer_id;
    const lecturer = await Lecturer.getLecturerById(lecturer_id);

    // format date of birth
    lecturer.dob = format(lecturer.dob, "yyyy-MM-dd");

    const lecturer_account = await Account.getAccountById(lecturer_id);
    res.render("admin/lecturer-detail", {
      isLogged: req.session.user ? true : false,
      account: req.session.user,
      lecturer: lecturer,
      lecturer_account: lecturer_account,
      pageTitle: "Lecturer Detail",
      path: "/admin/lecturers/" + lecturer_id,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/admin");
  }
};

// post update lecturer
exports.postLecturer = (req, res, next) => {
  const lecturer_id = req.params.lecturer_id;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const phone = req.body.phone;
  const address = req.body.address;

  // check if avatar is uploaded
  let avatar = null;
  try {
    avatar = req.file.filename;
  } catch {
    avatar = req.body.avatar ? req.body.avatar : null;
  }

  const email = req.body.email;
  const dob = req.body.dob;
  const info = req.body.info;

  const username = req.body.username;
  const password = req.body.password;
  // update lecturer
  const lecturer = new Lecturer(
    lecturer_id,
    first_name,
    last_name,
    phone,
    address,
    avatar,
    email,
    dob,
    info
  );
  Lecturer.updateLecturer(lecturer);

  // update account
  const account = new Account(username, password, 1, null, lecturer_id, null);
  Account.updateAccount(account);
  res.redirect("/admin/lecturers");
};

// post add lecturer
exports.postAddLecturer = async (req, res, next) => {
  let lecturer_id = null;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const phone = req.body.phone;
  const address = req.body.address;

  // check if avatar is uploaded
  let avatar = null;
  try {
    avatar = req.file.filename;
  } catch {}

  const email = req.body.email;
  const dob = req.body.dob;
  const info = req.body.info;

  const username = req.body.username;
  const password = req.body.password;

  const lecturer = new Lecturer(
    lecturer_id,
    first_name,
    last_name,
    phone,
    address,
    avatar,
    email,
    dob,
    info
  );
  // add lecturer
  const addLecturerStatus = await Lecturer.addLecturer(lecturer);

  // add account
  lecturer_id = addLecturerStatus[0].insertId;
  const account = new Account(username, password, 1, null, lecturer_id, null);
  Account.addAccount(account);
  res.redirect("/admin/lecturers");
};

// delete lecturer
exports.deleteLecturer = (req, res, next) => {
  const lecturer_id = req.params.lecturer_id;
  Lecturer.deleteLecturer(lecturer_id);
  Account.deleteAccount(lecturer_id);
  res.redirect("/admin/lecturers");
};
// ------------- END ----------------

// ------------- COURSE CONTROLLER -------------
exports.postAddCourse = (req, res, next) => {
  const course_id = null;
  const title = req.body.title;
  const infomation = req.body.infomation;
  const ref = req.body.ref;
  const fee = req.body.fee;

  // check if avatar is uploaded
  let thumbnail = null;
  try {
    thumbnail = req.file.filename;
  } catch {}

  const course = new Course(course_id, title, infomation, ref, fee, thumbnail);
  console.log(course);
  Course.addCourse(course);
  res.redirect("/admin/courses");
};

// get courses
exports.getCourses = async (req, res, next) => {
  const courses = await Course.getAllCourses();
  res.render("admin/courses", {
    isLogged: req.session.user ? true : false,
    account: req.session.user,
    courses: courses,
    pageTitle: "Courses",
    path: "/admin/courses",
  });
};

// get add course
exports.getAddCourse = (req, res, next) => {
  res.render("admin/add-course", {
    isLogged: req.session.user ? true : false,
    account: req.session.user,
    pageTitle: "Add Course",
    path: "/admin/add-course",
    formsCSS: true,
    productCSS: true,
    activeAddLecturer: true,
  });
};

// get course detail
exports.getCourse = async (req, res, next) => {
  try {
    const course_id = req.params.course_id;
    const course = await Course.getCourseById(course_id);

    res.render("admin/course-detail", {
      isLogged: req.session.user ? true : false,
      account: req.session.user,

      course: course,
      pageTitle: "Course Detail",
      path: "/admin/courses/" + course_id,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/admin");
  }
};

// update course
exports.postCourse = (req, res, next) => {
  const course_id = req.params.course_id;
  const title = req.body.title;
  const infomation = req.body.infomation;
  const ref = req.body.ref;
  const fee = req.body.fee;

  // check if avatar is uploaded
  let thumbnail = null;
  try {
    thumbnail = req.file.filename;
  } catch {
    thumbnail = req.body.thumbnail ? req.body.thumbnail : null;
  }

  const course = new Course(course_id, title, infomation, ref, fee, thumbnail);
  Course.updateCourse(course);

  res.redirect("/admin/courses");
};

// delete course
exports.deleteCourse = (req, res, next) => {
  const course_id = req.params.course_id;
  Course.deleteCourse(course_id);
  res.redirect("/admin/courses");
};
// ------------- END ----------------
