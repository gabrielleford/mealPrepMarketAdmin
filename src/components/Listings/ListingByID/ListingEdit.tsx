import React, { ChangeEvent } from "react";
import APIURL from "../../helpers/environment";
import { Buffer } from "buffer";
import { Link, Navigate } from "react-router-dom";
import { Avatar, Button, Center, Grid, Group, Input, Select, Text, Title, Textarea } from "@mantine/core";
import ListingById, { ListingProps, ListingState } from ".";

type EditProps = {
  sessionToken: ListingProps['sessionToken'],
  fetchedListing: ListingState['fetchedListing'],
  handleChange: ListingById['handleChange'],
}

export type EditState = {
  file: string,
  profileID: string,
  previewSrc: string | ArrayBuffer | null,
  stringPrvwSrc: string,
  newProfilePic: boolean,
  responseCode: number,
  inputVisible: boolean,
  editDescription: boolean,
  editTitle: boolean,
  editTags: boolean,
  editPrice: boolean,
  titleErr: boolean,
  descriptionErr: boolean,
  priceErr: boolean,
  _isMounted: boolean,
}

export default class ListingEdit extends React.Component<EditProps, EditState> {
  constructor(props:EditProps) {
    super(props)

    this.state = {
      file: '',
      profileID: window.location.pathname.slice(6, 42),
      previewSrc: '',
      stringPrvwSrc: '',
      newProfilePic: false,
      responseCode: 0,
      inputVisible: false,
      editDescription: false,
      editTitle: false,
      editTags: false,
      editPrice: false,
      titleErr: false,
      descriptionErr: false,
      priceErr: false,
      _isMounted: false,
    }

    // this.renderTitle = this.renderTitle.bind(this);
    // this.renderPrice = this.renderPrice.bind(this);
    // this.renderImage = this.renderImage.bind(this);
    // this.renderDescription = this.renderDescription.bind(this);
    this.setEdit = this.setEdit.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.changeTags = this.changeTags.bind(this);
    this.handleImage = this.handleImage.bind(this);
    this.previewImage = this.previewImage.bind(this);
    this.previewImgSrc = this.previewImgSrc.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.renderComponent = this.renderComponent.bind(this);
  }

    // ** Render listing info & switch to input on click ** //
    renderTitle = () => {
      if (!this.state.editTitle) {
        return (
          <>
            <Title className="listingTitle" align="center" order={1} onClick={() => this.setEdit('title')}>{this.props.fetchedListing.title}</Title>
          </>
        )
      } else {
        return (
            <Group position="center">
              <Input name="title" radius='md' value={this.props.fetchedListing.title} onChange={this.props.handleChange}/>
            </Group>
        )
      }
    }
  
    renderPrice = () => {
      if (!this.state.editPrice) {
        return (
          <Grid.Col>
            <Center>
              <Text sx={{cursor: 'pointer'}} onClick={() => this.setEdit('email')}>{this.props.fetchedListing.price}</Text>
            </Center>
          </Grid.Col>
        )
      } else {
        return (
          <Grid.Col>
            <Center>
              <Input name='email' radius='md' value={this.props.fetchedListing.price} onChange={this.props.handleChange}/>
            </Center>
          </Grid.Col>
        )
      }
    }
  
    // renderImage = () => {
    //   if (this.props.fetchedUser.profilePicture !== '') {
    //     return (
    //       <Group direction="column">
    //         <label className='avatarLabel' htmlFor="image">
    //           {this.state.stringPrvwSrc ? 
    //             <Avatar className="avatar" src={this.state.stringPrvwSrc} size={80} radius={40} /> :
    //             <Avatar className="avatar" size={80} radius={40} src={this.props.fetchedUser.profilePicture} />
    //           }
    //         </label>
    //         <input id='image' name='image' type='file' value={this.state.file} className="avatarInput" onChange={this.handleImage} />
    //         {this.state.file !== '' && <Text size="xs">{this.state.file.replace('C:\\fakepath\\', '')}</Text>}
    //       </Group>
    //     )
    //   } else {
    //     return(
    //       <Group direction="column" position="center">
    //         <label className="avatarLabel" htmlFor="image">
    //           {this.state.stringPrvwSrc ?
    //           <Avatar className="avatar" src={this.state.stringPrvwSrc} size={80} radius={40} /> :
    //           <Avatar className="avatar" color='primary' size={80} radius={40} />}
    //         </label>
    //         <input id='image' name='image' type='file' value={this.state.file} className="avatarInput" onChange={this.handleImage} />
    //         {this.state.file !== '' && <Text size="xs">{this.state.file.replace('C:\\fakepath\\', '')}</Text>}
    //       </Group>
    //     )
    //   }
    // }
  
    renderDescription = () => {
      if (!this.state.editDescription) {
        return (
          <Text mt={-7} className="description">{this.props.fetchedListing.description}
          <br/>

          </Text>
        )
        
      } else {
        return(
          <Textarea name='description' placeholder={this.props.fetchedListing.description} radius='md' invalid={this.state.descriptionErr ? true : false} required value={this.props.fetchedListing.description} onChange={this.props.handleChange} />
        )
      }
    }

    // renderTags = () => {
    //   if (!this.state.editRole) {
    //     return (
    //       <Grid.Col>
    //         <Center>
    //           {(this.props.fetchedUser.role === 'admin' || this.props.fetchedUser.role === 'main admin') ?
    //             <Text mt='1rem' onClick={() => this.setEdit('role')}>User Role: Admin</Text> :
    //           this.props.fetchedUser.role === 'primary' ?
    //             <Text mt='1rem' onClick={() => this.setEdit('role')}>User Role: Meal Prepper</Text> :
    //           this.props.fetchedUser.role === 'primary' ? '' :
    //             <Text mt='1rem' onClick={() => this.setEdit('role')}>User Role: Consumer</Text>
    //           }
    //         </Center>
    //       </Grid.Col>
    //     )
    //   } else {
    //     return (
    //       <Grid.Col>
    //         <Group position="center" spacing='xs' direction="column">
    //           <Text mt='1rem'>User Role</Text>
    //             <Select style={{width: '30%', margin: '0 auto'}} value={this.state.role} radius='md'
    //             data={[
    //               {value: 'admin', label:'Admin'},
    //               {value: 'primary', label:'Meal Prepper'},
    //               {value: 'secondary', label:'Consumer'},
    //               ]} onChange={this.changeTags} />
    //         </Group>
    //       </Grid.Col>
    //     )
    //   }
    // }
  
    setEdit = (name: string) => {
      switch(name) {
        case 'title':
          this.setState({
            editTitle: !this.state.editTitle,
            inputVisible: true,
          })
          break;
        case 'tags':
          this.setState({
            editTags: !this.state.editTags,
            inputVisible: true,
          })
          break;
        case 'description':
          this.setState({
            editDescription: !this.state.editDescription,
            inputVisible: true,
          })
          break;
        case 'price':
          this.setState({
            editPrice: !this.state.editPrice,
            inputVisible: true
          });
          break;
        default:
          this.setState({
            editDescription: false,
            editPrice: false,
            editTags: false,
            editTitle: false,
            inputVisible: false,
          })
      }
    }
  
    cancelEdit = () => {
      this.setState({
        editDescription: false,
        editPrice: false,
        editTitle: false,
        editTags: false,
        inputVisible: false,
        file: '',
      })
    }

    changeTags = (role: string) => {
      this.setState({
        
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
  // if ((this.props.fetchedUser.role === 'primary' || this.props.fetchedUser.role === 'admin' || this.props.fetchedUser.role === 'main admin') && this.state.newProfilePic && this.state.stringPrvwSrc !== '') {
  //   this.updateListingImage(this.state.stringPrvwSrc)
  // } else {
  //   this.updateUserInfo();
  // }
}

updateListingImage = async (encodedImg: string):Promise<void> => {
    const formData = new FormData();
    formData.append('file', encodedImg);
    formData.append('upload_preset', 'MealPrepMarketAvatar');

    const res = await fetch(`https://api.cloudinary.com/v1_1/gabrielleford/image/upload`, {
      method: 'POST',
      body: formData,
    })
    const cloudinary = await res.json();
    console.log(cloudinary);

    await fetch(`${APIURL}/user/${this.state.profileID}`, {
      method: 'PUT',
      body: JSON.stringify({
        // user: {
        //   role: this.props.fetchedUser.role,
        //   firstName: this.props.fetchedUser.firstName,
        //   lastName: this.props.fetchedUser.lastName,
        //   email: this.props.fetchedUser.email,
        //   profilePicture: cloudinary.url,
        //   profileDescription: this.props.fetchedUser.profileDescription,
        // }
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
        // authorization: `Bearer ${this.props.sessionToken}`
      })
    })
    .then(res => {
      this.state._isMounted && this.setState({
        responseCode: res.status
      })
    })
    .then(() => {
      this.state._isMounted && this.setState({
        file: '',
        previewSrc: '',
        stringPrvwSrc: '',
        editDescription: false,
        editPrice: false,
        editTags: false,
        editTitle: false,
        inputVisible: false,
        responseCode: 0,
      })
    })
    .catch(error => console.log(error))
}

updateUserInfo = async ():Promise<void> => {
  await fetch(`${APIURL}/user/${this.state.profileID}`, {
    method: 'PUT',
    body: JSON.stringify({
      // user: {
      //   role: this.props.fetchedUser.role,
      //   firstName: this.props.fetchedUser.firstName,
      //   lastName: this.props.fetchedUser.lastName,
      //   email: this.props.fetchedUser.email,
      //   profilePicture: this.props.fetchedUser.profilePicture,
      //   profileDescription: this.props.fetchedUser.profileDescription,
      // }
    }),
    headers: new Headers({
      'Content-Type': 'application/json',
      // authorization: `Bearer ${this.props.sessionToken}`
    })
  })
  .then(res => {
    this.state._isMounted && this.setState({
      responseCode: res.status
    })
    return res.json()
  })
  .then(res => {
    this.state._isMounted &&  this.setState({
      file: '',
      previewSrc: '',
      stringPrvwSrc: '',
      editDescription: false,
      editPrice: false,
      editTitle: false,
      editTags: false,
      inputVisible: false,
      responseCode: 0,
    })
  })
  .catch(error => console.log(error))
}

  componentDidMount() {
    this.setState({
      _isMounted: true,
    })
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
      <>
        {this.renderTitle()}
        <Group spacing={5} position="center"> 
          <Text size="lg" sx={{color: '#379683', fontFamily: 'Open-Sans, sans-serif'}} align="center" variant="link" component={Link} to={`/user/${this.props.fetchedListing.ownerID}`}>{this.props.fetchedListing.user.firstName} {this.props.fetchedListing.user.lastName}</Text>
        </Group>
        <Center>

        </Center>
      {/* <Grid sx={{color: '#edf5e1', margin: 'auto'}}>
        <Grid.Col>
        </Grid.Col>
        <Grid.Col>
          <Group mt='lg' position="center">
            <Button className="formButton" size="lg" radius='md' compact onClick={() => console.log('delete')}>Delete</Button>
            <Button component={Link} to={`/orders/${this.props.fetchedUser.id}`} className="formButton" size="lg" radius='md' compact>My Orders</Button>
          </Group>
        </Grid.Col>
        <Grid.Col>
          <Center>

          </Center>
        </Grid.Col> */}
        {/* {this.props.dlt && 
          <ConfirmDelete what={this.props.what} dlt={this.props.dlt} sessionToken={this.props.sessionToken} listingID={this.props.listingID} user={this.props.user} setDelete={this.props.setDelete} clearToken={this.props.clearToken} response={this.props.response} setResponse={this.props.setResponse} />
        } */}
        {!localStorage.getItem('Authorization') && <Navigate to='/' replace={true} />}
    {/* </Grid> */}
      </>
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