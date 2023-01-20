import React, { ChangeEvent } from "react";
import APIURL from "../../helpers/environment";
import { Buffer } from "buffer";
import { Navigate } from "react-router-dom";
import UserInfo, { UserProps, UserState } from "./UserInfo";
import ConfirmDelete from "../../Delete";
import { Avatar, Button, Center, Grid, Group, Input, Select, Text, Textarea } from "@mantine/core";

type EditProps = {
  app: UserProps
  fetchedUser: UserState['fetchedUser'],
  setUser: UserInfo['setUser'],
  handleChange: UserInfo['handleChange'],
  changeRoleInfo: UserInfo['changeRoleInfo'],
  fetchUser: UserInfo['fetchUser'],
}

export type EditState = {
  role: string,
  file: string,
  profileID: string,
  previewSrc: string | ArrayBuffer | null,
  stringPrvwSrc: string,
  newProfilePic: boolean,
  responseCode: number,
  inputVisible: boolean,
  editDescription: boolean,
  editName: boolean,
  editEmail: boolean,
  editRole: boolean,
  _isMounted: boolean,
}

export default class UserEdit extends React.Component<EditProps, EditState> {
  constructor(props:EditProps) {
    super(props)

    this.state = {
      role: this.props.fetchedUser.role,
      file: '',
      profileID: window.location.pathname.slice(6, 42),
      previewSrc: '',
      stringPrvwSrc: '',
      newProfilePic: false,
      responseCode: 0,
      inputVisible: false,
      editDescription: false,
      editName: false,
      editEmail: false,
      editRole: false,
      _isMounted: false,
    }

    this.renderName = this.renderName.bind(this);
    this.renderEmail = this.renderEmail.bind(this);
    this.renderAvatar = this.renderAvatar.bind(this);
    this.renderDescription = this.renderDescription.bind(this);
    this.setEdit = this.setEdit.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.handleImage = this.handleImage.bind(this);
    this.previewImage = this.previewImage.bind(this);
    this.previewImgSrc = this.previewImgSrc.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.renderComponent = this.renderComponent.bind(this);
  }

    // ** Render user info & switch to input on click ** //
    renderName = () => {
      if (!this.state.editName) {
        return (
          <Grid.Col>
              <Group position="center">
                <Text sx={{cursor: 'pointer'}} size="xl" onClick={() => this.setEdit('name')}>{this.props.fetchedUser.firstName}</Text>
                <Text sx={{cursor: 'pointer'}} size="xl" onClick={() => this.setEdit('name')}>{this.props.fetchedUser.lastName}</Text>
              </Group>
          </Grid.Col>
        )
      } else {
        return (
          <Grid.Col>
            <Group position="center">
              <Input name="firstName" radius='md' value={this.props.fetchedUser.firstName} onChange={this.props.handleChange}/>
              <Input name='lastName' radius='md' value={this.props.fetchedUser.lastName} onChange={this.props.handleChange} />
            </Group>
          </Grid.Col>
        )
      }
    }
  
    renderEmail = () => {
      if (!this.state.editEmail) {
        return (
          <Grid.Col>
            <Center>
              <Text sx={{cursor: 'pointer'}} onClick={() => this.setEdit('email')}>{this.props.fetchedUser.email}</Text>
            </Center>
          </Grid.Col>
        )
      } else {
        return (
          <Grid.Col>
            <Center>
              <Input name='email' radius='md' value={this.props.fetchedUser.email} onChange={this.props.handleChange}/>
            </Center>
          </Grid.Col>
        )
      }
    }
  
    renderAvatar = () => {
      if (this.props.fetchedUser.profilePicture !== '') {
        return (
          <Group direction="column">
            <label className='avatarLabel' htmlFor="image">
              {this.state.stringPrvwSrc ? 
                <Avatar className="avatar" src={this.state.stringPrvwSrc} size={80} radius={40} /> :
                <Avatar className="avatar" size={80} radius={40} src={this.props.fetchedUser.profilePicture} />
              }
            </label>
            <input id='image' name='image' type='file' value={this.state.file} className="avatarInput" onChange={this.handleImage} />
            {this.state.file !== '' && <Text size="xs">{this.state.file.replace('C:\\fakepath\\', '')}</Text>}
          </Group>
        )
      } else {
        return(
          <Group direction="column" position="center">
            <label className="avatarLabel" htmlFor="image">
              {this.state.stringPrvwSrc ?
              <Avatar className="avatar" src={this.state.stringPrvwSrc} size={80} radius={40} /> :
              <Avatar className="avatar" color='primary' size={80} radius={40} />}
            </label>
            <input id='image' name='image' type='file' value={this.state.file} className="avatarInput" onChange={this.handleImage} />
            {this.state.file !== '' && <Text size="xs">{this.state.file.replace('C:\\fakepath\\', '')}</Text>}
          </Group>
        )
      }
    }
  
    renderDescription = () => {
      if (!this.state.editDescription) {
        if (this.props.fetchedUser.profileDescription !== '') {
          return (
            <>
              {this.props.fetchedUser.profileDescription.length > 40 && this.props.fetchedUser.profileDescription.length < 100 ? 
                <Text sx={{cursor: 'pointer', maxWidth: '200px'}} onClick={() => this.setEdit('description')}>{this.props.fetchedUser.profileDescription}</Text> :
                <Text sx={{cursor: 'pointer'}} onClick={() => this.setEdit('description')}>{this.props.fetchedUser.profileDescription}</Text>
              }
            </>
          )
        } else {
          return (
            <Group direction="column" position="center">
              <Text sx={{cursor: 'pointer'}} onClick={() => this.setEdit('description')}>You don't have a description, yet&#128577;</Text>
              <Text sx={{cursor: 'pointer'}} mt={-10} onClick={() => this.setEdit('description')}>Click me to add one!</Text>
            </Group>
          )
        }
      } else {
        return(
          <Textarea name="profileDescription" radius='md' value={this.props.fetchedUser.profileDescription} onChange={this.props.handleChange} />
        )
      }
    }

    renderRole = () => {
      if (!this.state.editRole) {
        return (
          <Grid.Col>
            <Center>
              {(this.props.fetchedUser.role === 'admin' || this.props.fetchedUser.role === 'main admin') ?
                <Text sx={{cursor: 'pointer'}} mt='1rem' onClick={() => this.setEdit('role')}>User Role: Admin</Text> :
              this.props.fetchedUser.role === 'primary' ?
                <Text sx={{cursor: 'pointer'}} mt='1rem' onClick={() => this.setEdit('role')}>User Role: Meal Prepper</Text> :
              this.props.fetchedUser.role === 'primary' ? '' :
                <Text sx={{cursor: 'pointer'}} mt='1rem' onClick={() => this.setEdit('role')}>User Role: Consumer</Text>
              }
            </Center>
          </Grid.Col>
        )
      } else {
        return (
          <Grid.Col>
            <Group position="center" spacing='xs' direction="column">
              <Text mt='1rem'>User Role</Text>
                <Select style={{width: '30%', margin: '0 auto'}} value={this.props.fetchedUser.role} radius='md'
                data={[
                  {value: 'admin', label:'Admin'},
                  {value: 'primary', label:'Meal Prepper'},
                  {value: 'secondary', label:'Consumer'},
                  ]} onChange={this.props.changeRoleInfo} />
            </Group>
          </Grid.Col>
        )
      }
    }
  
    setEdit = (name: string) => {
      switch(name) {
        case 'name':
          this.setState({
            editName: !this.state.editName,
            inputVisible: true,
          })
          break;
        case 'email':
          this.setState({
            editEmail: !this.state.editEmail,
            inputVisible: true,
          })
          break;
        case 'description':
          this.setState({
            editDescription: !this.state.editDescription,
            inputVisible: true,
          })
          break;
        case 'role':
          this.setState({
            editRole: !this.state.editRole,
            inputVisible: true
          });
          break;
        default:
          this.setState({
            editDescription: false,
            editEmail: false,
            editName: false,
            editRole: false,
            inputVisible: false,
          })
      }
    }
  
    cancelEdit = () => {
      this.setState({
        editDescription: false,
        editEmail: false,
        editName: false,
        editRole: false,
        inputVisible: false,
        file: '',
      })
    }

  // ** Logic for updating user info ** //
  handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      file: e.target.value,
      newProfilePic: true,
    })

    var {files} = e.currentTarget;
    if (files && files?.length > 0) {
      this.previewImage(files[0]);
    }
  }

  previewImage = (file: File) => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => this.setState({
      previewSrc: reader.result
      });
    if (this.state.previewSrc !== '') {
      this.previewImgSrc(this.state.previewSrc);
    }
  }

  previewImgSrc = (prvwFile: any) => {
  if (prvwFile) {
    this.setState({
      stringPrvwSrc: Buffer.from(prvwFile).toString(),
      inputVisible: true,
    })
  }
}

handleUpdate = () => {
  if ((this.props.fetchedUser.role === 'primary' || this.props.fetchedUser.role === 'admin' || this.props.fetchedUser.role === 'main admin') && this.state.newProfilePic && this.state.stringPrvwSrc !== '') {
    this.updateUserProfilePic(this.state.stringPrvwSrc)
  } else {
    this.updateUserInfo();
  }
}

updateUserProfilePic = async (encodedImg: string):Promise<void> => {
    const formData = new FormData();
    formData.append('file', encodedImg);
    formData.append('upload_preset', 'MealPrepMarketAvatar');

    const res = await fetch(`https://api.cloudinary.com/v1_1/gabrielleford/image/upload`, {
      method: 'POST',
      body: formData,
    })
    const cloudinary = await res.json();
    console.log(cloudinary);

    await fetch(`${APIURL}/user/edit/${this.state.profileID}`, {
      method: 'PUT',
      body: JSON.stringify({
        user: {
          role: this.props.fetchedUser.role,
          firstName: this.props.fetchedUser.firstName,
          lastName: this.props.fetchedUser.lastName,
          email: this.props.fetchedUser.email,
          profilePicture: cloudinary.url,
          profileDescription: this.props.fetchedUser.profileDescription,
        }
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
        authorization: `Bearer ${this.props.app.sessionToken}`
      })
    })
    .then(res => {
      this.state._isMounted && this.setState({
        responseCode: res.status
      })
    })
    .then(() => {
      this.getUpdatedUser();
    })
    .catch(error => console.log(error))
}

updateUserInfo = async ():Promise<void> => {
  await fetch(`${APIURL}/user/edit/${this.state.profileID}`, {
    method: 'PUT',
    body: JSON.stringify({
      user: {
        role: this.props.fetchedUser.role,
        firstName: this.props.fetchedUser.firstName,
        lastName: this.props.fetchedUser.lastName,
        email: this.props.fetchedUser.email,
        profilePicture: this.props.fetchedUser.profilePicture,
        profileDescription: this.props.fetchedUser.profileDescription,
      }
    }),
    headers: new Headers({
      'Content-Type': 'application/json',
      authorization: `Bearer ${this.props.app.sessionToken}`
    })
  })
  .then(res => {
    this.state._isMounted && this.setState({
      responseCode: res.status
    })
    return res.json()
  })
  .then(() => {
    this.getUpdatedUser();
  })
  .catch(error => console.log(error))
}

getUpdatedUser = async ():Promise<void> => {
  await fetch(`${APIURL}/user/userInfo/${this.state.profileID}`, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      authorization: `Bearer ${this.props.app.sessionToken}`
    })
  })
  .then(res => {
    console.log(res)
    this.setState({
      file: '',
      previewSrc: '',
      stringPrvwSrc: '',
      editDescription: false,
      editName: false,
      editEmail: false,
      editRole: false,
      inputVisible: false,
      responseCode: 0,

    })
    return res.json()
  })
  .then(res => {
    this.props.setUser(res);
    console.log(res)
  });
}

  componentDidMount() {
    this.setState({
      _isMounted: true,
    })
    this.props.app.setWhat('user')
    this.props.app.setEndpointID(this.props.fetchedUser.id)
  }

  componentDidUpdate(prevProps:Readonly<EditProps>, prevState:Readonly<EditState>) {
    if(this.state.previewSrc !== prevState.previewSrc ) {
      this.previewImgSrc(this.state.previewSrc);
    }
    if (this.state.inputVisible !== prevState.inputVisible) {
      this.renderComponent();
    }
  }

  componentWillUnmount() {
    this.setState({
      _isMounted: false
    })
  }

  renderComponent = () => {
    return (
      <Grid sx={{color: '#edf5e1', margin: 'auto'}}>
      {this.props.fetchedUser.role !== 'secondary' && 
        <Grid.Col>
          {this.props.fetchedUser.profileDescription.length >= 100 ?
            <Group position="center" direction="column">
              {this.renderAvatar()}
              {this.renderDescription()}
            </Group> :
            <Group position="center">
              {this.renderAvatar()}
              {this.renderDescription()}
            </Group>
          }
        </Grid.Col>
      }
      {this.renderName()}
      {this.renderEmail()}
      {this.renderRole()}
      {this.state.inputVisible && 
        <Grid.Col>
          <Group mt='sm' position="center">
            <Button onClick={this.handleUpdate} className="formButton" size="sm" radius='md' compact >Save Changes</Button>
            <Button onClick={this.cancelEdit} className='formButton' size="sm" radius='md' compact>Cancel</Button>
          </Group>
        </Grid.Col>
      }
      <Grid.Col>
        <Group mt='lg' position="center">
          <Button className="formButton" size="lg" radius='md' compact onClick={() => this.props.app.setDlt(true)}>Delete</Button>
        </Group>
      </Grid.Col>
      <Grid.Col>
        <Center>

        </Center>
      </Grid.Col>
      {this.props.app.dlt && <ConfirmDelete sessionToken={this.props.app.sessionToken} what={this.props.app.what} dlt={this.props.app.dlt} setDlt={this.props.app.setDlt} endpointID={this.props.app.endpointID} setEndpointID={this.props.app.setEndpointID} response={this.props.app.response} setResponse={this.props.app.setResponse}/>}
      {!localStorage.getItem('Authorization') && <Navigate to='/' replace={true} />}
      {this.props.app.response === 200 && <Navigate to='/users' replace={true} />}
    </Grid>
    )
  }

  render(): React.ReactNode {
    return (
      <>
        {this.renderComponent()}
      </>
    )
  }
}