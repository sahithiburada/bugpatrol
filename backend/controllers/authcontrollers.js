const User = require('../models/User');
const Authority = require('../models/Authority');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// User Registration
const registerUser = async (req, res) => {
  try {
    
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'User registration failed', error: err.message });
  }
};

// Authority Registration
const registerAuthority = async (req, res) => {
  try {
    
    const newAuthority = new Authority(req.body);
    await newAuthority.save();
    res.status(201).json({ message: 'Authority registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Authority registration failed', error: err.message });
  }
};

// User Login with Session
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Use async compare
    console.log(user.password, password);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Store session
    req.session.user = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: 'citizen'
    };

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: 'citizen' },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );
    console.log("loggend");
    res.status(200).json({
      message: 'Logged in successfully',
      user: req.session.user,
      token
    });

  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// Authority Login with Session
const loginAuthority = async (req, res) => {
  try {
    const { email, password } = req.body;
    const authority = await Authority.findOne({ email });
    
    
    if (!authority) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Use async compare
    const isPasswordValid = await bcrypt.compare(password, authority.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
     console.log("loggend");
      
    // Store session
    req.session.user = {
      id: authority._id,
      email: authority.email,
      name: authority.name,
      department: authority.department,
      position: authority.position,
      role: 'authority'
    };

    // Create JWT token
    const token = jwt.sign(
      { 
        id: authority._id, 
        email: authority.email, 
        department: authority.department,
        
        role: 'authority' 
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({ 
      message: 'Logged in successfully', 
      user: req.session.user,
      token,
    });

  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};
module.exports = { registerUser, registerAuthority, loginUser, loginAuthority };
