import axios from "axios";
import { describe, it } from "mocha"; // Mocha'nın describe ve it fonksiyonlarını içe aktarıyoruz
import { expect } from "chai"; // Chai'nin expect fonksiyonunu içe aktarıyoruz
import dotenv from "dotenv";
import redisClient from "../redis/RedisConfigration.js";

//dotnev configration
dotenv.config({ path: "./.env.development.local" });

//redis configration
(async () => {
  try {
    await redisClient.connect();
  } catch (error) {}
})();

const adminTestToken = process.env.ADMIN_TEST_TOKEN;
const adminWrongTestToken = process.env.ADMINT_TEST_WRONG_TOKEN;
const endpoint = process.env.API_ENDPOINT;

const defaultAdmin = {
  name: process.env.ADMIN_TEST_NAME,
  surname: process.env.ADMIN_TEST_SURNAME,
  email: process.env.ADMIN_TEST_EMAIL,
  password: process.env.ADMIN_TEST_PASSWORD,
  img: process.env.ADMIN_TEST_IMG,
  occupation: process.env.ADMIN_TEST_OCCUPATION,
  phoneNumber: process.env.ADMIN_TEST_PHONE_NUMBER,
};

const defaultAdminForUpdate = {
  id: process.env.ADMIN_TEST_ID,
  name: process.env.ADMIN_TEST_NAME,
  surname: process.env.ADMIN_TEST_SURNAME,
  email: process.env.ADMIN_TEST_EMAIL,
  password: process.env.ADMIN_TEST_PASSWORD,
  img: process.env.ADMIN_TEST_IMG,
  occupation: process.env.ADMIN_TEST_OCCUPATION,
  phoneNumber: process.env.ADMIN_TEST_PHONE_NUMBER,
};

const defaultAdminWithMissingEmail = {
  name: process.env.ADMIN_TEST_NAME,
  surname: process.env.ADMIN_TEST_SURNAME,
  password: process.env.ADMIN_TEST_PASSWORD,
  img: process.env.ADMIN_TEST_IMG,
  occupation: process.env.ADMIN_TEST_OCCUPATION,
  phoneNumber: process.env.ADMIN_TEST_PHONE_NUMBER,
};

const defaultAdminForLogin = {
  email: process.env.ADMIN_TEST_EMAIL,
  password: process.env.ADMIN_TEST_PASSWORD,
};

const defaultAdminForLoginWithWrongPassword = {
  email: process.env.ADMIN_TEST_EMAIL,
  password: `${process.env.ADMIN_TEST_PASSWORD}0000000`,
};

const defaultAdminForLoginWithNotExistEmail = {
  email: `${process.env.ADMIN_TEST_EMAIL}000000`,
  password: process.env.ADMIN_TEST_PASSWORD,
};

describe("Successfully Admin Tests", function () {
  it("Should add admin successfully.", async function () {
    let res;
    await axios
      .post(`${endpoint}admintest/addadmin/${adminTestToken}`, defaultAdmin)
      .then((response) => (res = response.data.status));

    expect(res).to.equal("ok");
  });
  it("Admin login test. Should login as an admin successfully.", async function () {
    let res;
    await axios
      .post(`${endpoint}admintest/login`, defaultAdminForLogin)
      .then((response) => (res = response.data.status));

    expect(res).to.equal("ok");
  });
  it("Admin logout test. Should logout successfully.", async function () {
    let res;
    await axios
      .post(`${endpoint}admintest/logout/${adminTestToken}`)
      .then((response) => (res = response.data.status));

    expect(res).to.equal("ok");
  });
  it("Get all admins from database test. Should get all of the admins from the database", async function () {
    let res;
    let fromCache;
    await redisClient.del("admins");
    await axios.get(`${endpoint}admintest/get`).then((response) => {
      res = response.data.status;
      fromCache = response.data.fromCache;
    });

    expect(res).to.equal("ok");
    expect(fromCache).to.equal(false);
  });
  it("Get all admins from cache test. Should get all of the admins from the redis cache.", async function () {
    let res;
    let fromCache;
    await axios.get(`${endpoint}admintest/get`).then((response) => {
      res = response.data.status;
      fromCache = response.data.fromCache;
    });

    expect(res).to.equal("ok");
    expect(fromCache).to.equal(true);
  });
});

describe("Unsuccessfully Admin Tests", function () {
  it("Unauthorized test. Shouldn't add admin successfully.", async function () {
    let res;
    await axios
      .post(
        `${endpoint}admintest/addadmin/${adminWrongTestToken}`,
        defaultAdmin
      )
      .then((response) => (res = response.data.status))
      .catch((error) => (res = error.response.data.status));

    expect(res).to.equal("no");
  });
  it("Add admin test with missing data. Shouldn't add admin successfully.", async function () {
    let res;
    await axios
      .post(
        `${endpoint}admintest/addadmin/${adminTestToken}`,
        defaultAdminWithMissingEmail
      )
      .then((response) => (res = response.data.status))
      .catch((error) => (res = error.response.data.status));

    expect(res).to.equal("no");
  });
  it("Admin login test with wrong password. Shouldn't login as an admin successfully.", async function () {
    let res;
    await axios
      .post(`${endpoint}admintest/login`, defaultAdminForLoginWithWrongPassword)
      .then((response) => (res = response.data.status))
      .catch((error) => (res = error.response.data.status));
    expect(res).to.equal("no");
  });
  it("Admin login test with no exist admin. Shouldn't login as an admin successfully.", async function () {
    let res;
    await axios
      .post(`${endpoint}admintest/login`, defaultAdminForLoginWithNotExistEmail)
      .then((response) => (res = response.data.status))
      .catch((error) => (res = error.response.data.status));

    expect(res).to.equal("no");
  });
  it("Admin logout test with wrong token. Shouldn't logout successfully", async function () {
    let res;
    await axios
      .post(`${endpoint}admintest/logout/${adminWrongTestToken}`)
      .then((response) => (res = response.data.status))
      .catch((error) => (res = error.response.data.status));

    expect(res).to.equal("no");
  });
});
