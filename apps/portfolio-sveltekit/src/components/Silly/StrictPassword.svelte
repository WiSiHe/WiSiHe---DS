<script>
  let password = ''
  let requirements = {
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  }

  const specialCharacters = /[!@#$%^&*()_+{}\[\]:;"'<>,.?~\\/-]/

  function validatePassword(pass) {
    requirements.length = pass.length >= 12
    requirements.uppercase = /[A-Z]/.test(pass)
    requirements.lowercase = /[a-z]/.test(pass)
    requirements.number = /[0-9]/.test(pass)
    requirements.special = specialCharacters.test(pass)
  }

  function handleInput(event) {
    password = event.target.value
    validatePassword(password)
  }

  function isValid() {
    return Object.values(requirements).every(Boolean)
  }
</script>

<div class="password-container">
  <input
    type="password"
    placeholder="Enter your password"
    on:input={handleInput}
  />
  <div class="requirement-list">
    <div class="requirement {requirements.length ? 'valid' : 'invalid'}">
      <span>{requirements.length ? '✓' : '✗'}</span>
      Minimum 12 characters
    </div>
    <div class="requirement {requirements.uppercase ? 'valid' : 'invalid'}">
      <span>{requirements.uppercase ? '✓' : '✗'}</span>
      At least one uppercase letter
    </div>
    <div class="requirement {requirements.lowercase ? 'valid' : 'invalid'}">
      <span>{requirements.lowercase ? '✓' : '✗'}</span>
      At least one lowercase letter
    </div>
    <div class="requirement {requirements.number ? 'valid' : 'invalid'}">
      <span>{requirements.number ? '✓' : '✗'}</span>
      At least one number
    </div>
    <div class="requirement {requirements.special ? 'valid' : 'invalid'}">
      <span>{requirements.special ? '✓' : '✗'}</span>
      At least one special character
    </div>
  </div>
  {#if isValid()}
    <div class="valid-feedback">Password is strong!</div>
  {/if}
</div>

<style>
  .password-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px;
    width: 300px;
  }

  input[type='password'] {
    width: 100%;
    padding: 8px;
    font-size: 16px;
    border: 2px solid #007bff;
    border-radius: 4px;
    outline: none;
    transition: border-color 0.3s ease-in-out;
  }

  input[type='password']:focus {
    border-color: #0056b3;
  }

  .requirement-list {
    margin-top: 10px;
    width: 100%;
  }

  .requirement {
    color: #555;
    font-size: 14px;
    display: flex;
    align-items: center;
  }

  .requirement.valid {
    color: #28a745;
  }

  .requirement.invalid {
    color: #dc3545;
  }

  .requirement span {
    margin-left: 10px;
  }
</style>
