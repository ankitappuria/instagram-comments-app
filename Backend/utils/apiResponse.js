class ApiResponse {
  constructor({ success, data = null, message = '' }) {
    this.success = success;
    this.data = data;
    this.message = message;
  }

  static success(data, message = '') {
    return new ApiResponse({
      success: true,
      data,
      message
    });
  }

  static error(message = 'Something went wrong', code = 'INTERNAL_ERROR') {
    return {
      success: false,
      error: {
        message,
        code
      }
    };
  }
}

module.exports = ApiResponse;