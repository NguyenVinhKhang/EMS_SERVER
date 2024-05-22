import { FakeRepository } from "../../repositories/index.js";
import HTTPCode from "../../exception/HTTPStatusCode.js";
const generateFakeAccount = async (req, res) => {
  try {
    const response = await FakeRepository.generateFakeAccount();
    res.status(HTTPCode.INSERT_OK).json({
      message: response,
    });
  } catch (exception) {
    res.status(HTTPCode.BAD_REQUEST).json({
      message: exception.message,
    });
  }
};

export default { generateFakeAccount };
