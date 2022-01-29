// import hooks
import { useState, useEffect } from 'react';

// import axios
import axios from 'axios';

// import mui elements
import {
  Container,
  TextField,
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Paper,
  Avatar,
  Typography,
} from '@mui/material';
 
// import mui icons
import SendIcon from '@mui/icons-material/Send'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

//  import mui colors
import { blueGrey, pink } from '@mui/material/colors';

// generate avatar color
function stringToColor(string: string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }

  return color;
}

// first letter of Avatar
function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}`
  };
}
// Typescript types
type Response = {
  id: number 
  userName: string
  sex: string
  comment: string
}

function App() {

  // flag hook to get data
  const [flag, setFlag] = useState<boolean>(false);
  const changeFlag = () => {
    setFlag(!flag)
  }

  // hooks
  const [userName, setUserName] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [sex, setSex] = useState<string>('female');
  const [userData,setUserData ] = useState<Response[]>([]);

  useEffect(() => {
    axios
      .get<Response[]>('http://localhost:3000/persons')
      .then(resp => {console.log(resp.data);
      setUserData(resp.data)
    });
    setUserName('');
    setComment('');
  }, [flag]);

  // handle functions
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.id === "userName") {
      setUserName(event.target.value)
    }
    else if (event.target.id === "comment") {
      setComment(event.target.value)
    }
    else if (event.target.name === "sex") {
      setSex(event.target.value)
      console.log(event.target.value);
    }
  }

  const handleSendClick =() => {
    axios  
      .post<Response[]>('http://localhost:3000/persons', {
      userName,
      comment,
      sex
    })
    axios
      .get<Response[]>('http://localhost:3000/persons')
      .then(resp => {console.log(resp.data);
        setUserData(resp.data)
    });
    changeFlag()
  }

  const handleDeleteClick = (event: React.MouseEvent<HTMLElement>) => {
    axios
      .delete<Response[]>(`http://localhost:3000/persons/${(event.target as HTMLElement).id}`)
    axios 
      .get<Response[]>('http://localhost:3000/persons')
      .then(resp => {console.log(resp.data);
      setUserData(resp.data)
      })
    changeFlag()
  }
  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        bgcolor: blueGrey[700], 
        height: '100vh', 
        p:"10px"}}>
    <Typography
      variant="h5" 
      gutterBottom 
      component="div"
      sx={{
        textAlign: "center",
        backgroundColor: "#fff",
        p: "10px"
      }}
      >
        App contains relations with API. To do this app I used Typescript, Material UI, axios. App works only if json server will be run. Check ReadMe file for more information.
      </Typography> 
      <Box 
      sx={{
        bgcolor: "#fff",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        marginBottom: '20px'
      }}
      component="form"
      noValidate
      autoComplete="off"
    >

      <TextField
        required
        id="userName"
        label="Username"
        placeholder="Username"
        size="medium"
        onChange={handleChange}
        value={userName}
      />
      <TextField
        required
        id="comment"
        label="Comment"
        placeholder="Comment"
        onChange={handleChange}
        value={comment}
      />
      <FormControl component="fieldset">
        <FormLabel component="legend" sx={{fontSize: '20px'}}>Sex</FormLabel>
          <RadioGroup
            row
            name= "sex"
            onChange={handleChange} 
            value= {sex}
          >
            <FormControlLabel value="female" control={<Radio />} label="Female" sx={{
                '&, &.Mui-checked': {
                  color: pink[900]
                }
              }}/>
            <FormControlLabel value="male" control={<Radio />} label="Male" sx={{
                '&, &.Mui-checked': {
                  color: blueGrey[900],
                }
              }}/>
          </RadioGroup>
       </FormControl>
      <Button
        sx={{
          backgroundColor: (sex === "male" ? blueGrey[700] : pink[700]),
          color: '#fff',
          ':hover': {
            backgroundColor: (sex === "male" ? blueGrey[700] : pink[700]),
            color: '#fff'
          }
        }}
        size='large'
        endIcon={<SendIcon/>}
        onClick={handleSendClick}
      >
        SUBMIT
      </Button>
    </Box>
    {
            userData.map(item => {
              return(
                <Box
                key={item.id}
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: "center",
                '& > :not(style)': {
                  m: 1,
                  minWidth: "30%",
                  width: "auto",
                  minHeight: "auto",
                  height: "auto",
                  },
              }}
            >
              <Paper 
                elevation={3}
                sx={{
                  display:"flex",
                  flexDirection: "column",
                  padding: "10px",
                }}
              >
                <Box sx={{
                  display:"flex",
                  justifyContent:"space-between",
                  alignItems:"center",
                  marginBottom: "5px",
                  gap: "5px",
                  borderBottom: "2px solid black",
                  paddingBottom: "15px"
                }}>
                  <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px"
                    }}>
                    <Avatar {...stringAvatar(item.userName)}/>
                        <Typography
                          component="div"
                          sx={{
                            fontWeight: "bold",
                            display: "flex",
                          }}
                        >
                          {item.userName}
                        </Typography> 
                  </Box>
                  <Button
                          onClick={handleDeleteClick}
                          id= {item.id.toString()}
                          size='large'
                          endIcon={<DeleteForeverIcon/>}
                          sx ={{
                              backgroundColor: (item.sex === "male" ? blueGrey[700] : pink[700]),
                              color: '#fff',
                              ':hover': {
                                backgroundColor: (item.sex === "male" ? blueGrey[900] : pink[900]),
                                color: '#fff'
                              }
                          }}
                        >
                          delete
                        </Button>
                  </Box>
                  
                  <Box sx={{ textAlign: "center", padding: "10px"}}>
                    {item.comment}
                  </Box>
              </Paper>
            </Box>
              )
            })
          } 
  </Container>
  );
}

export default App;