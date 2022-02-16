import React, { ChangeEvent } from "react";
import APIURL from "../../helpers/environment";
import { Buffer } from "buffer";
import { Link, Navigate } from "react-router-dom";
import { BsEmojiDizzy, BsEmojiFrown } from 'react-icons/bs';
import ListingById, { ListingProps, ListingState } from ".";
import ConfirmDelete from "../../Delete";
import { Alert, Badge, Button, Card, Center, Group, Image, Input, NumberInput, Spoiler, Text, Title, Textarea } from "@mantine/core";

type EditProps = {
  app: ListingProps,
  listingState: ListingState
  handleChange: ListingById['handleChange'],
  handleNumber: ListingById['handleNumber'],
  fetchListing: ListingById['fetchListing'],
}

export type EditState = {
  file: string,
  listingID: string,
  previewSrc: string | ArrayBuffer | null,
  stringPrvwSrc: string,
  newProfilePic: boolean,
  responseCode: number,
  inputVisible: boolean,
  editDescription: boolean,
  editTitle: boolean,
  editTags: boolean,
  editPrice: boolean,
  submitted: boolean,
  errorMessage: string,
  _isMounted: boolean,
}

export default class ListingEdit extends React.Component<EditProps, EditState> {
  constructor(props:EditProps) {
    super(props)

    this.state = {
      file: '',
      listingID: window.location.pathname.slice(9, 45),
      previewSrc: '',
      stringPrvwSrc: '',
      newProfilePic: false,
      responseCode: 0,
      inputVisible: false,
      editDescription: false,
      editTitle: false,
      editTags: false,
      editPrice: false,
      submitted: false,
      errorMessage: '',
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
            <Title className="listingTitle" align="center" order={1} onClick={() => this.setEdit('title')}>{this.props.listingState.fetchedListing.title}</Title>
          </>
        )
      } else {
        return (
            <Group position="center">
              <Input name="title" radius='md' size='lg' value={this.props.listingState.fetchedListing.title} onChange={this.props.handleChange}/>
            </Group>
        )
      }
    }
  
    renderImage = () => {
        return (
          <Group direction="column">
            <label className='avatarLabel' htmlFor="image">
              {this.state.stringPrvwSrc ? 
                <Image className="avatar" radius={15} src={this.state.stringPrvwSrc} width={550} height={400}  /> :
                <Image className="avatar" radius={15} width={550} height={400} src={this.props.listingState.fetchedListing.image} />
              }
            </label>
            <input id='image' name='image' type='file' value={this.state.file} className="avatarInput" onChange={this.handleImage} />
            {this.state.file !== '' && <Text size="xs">{this.state.file.replace('C:\\fakepath\\', '')}</Text>}
          </Group>
        )
    }
  
    renderDescription = () => {
      if (!this.state.editDescription) {
        return (
          <>
            {this.props.listingState.fetchedListing.description.length > 255 ?
              <Spoiler maxHeight={70} showLabel='View more' hideLabel='View less'>
                <Text mt={-40} style={{paddingTop: '55px'}} className="description" onClick={() => this.setEdit('description')}>{this.props.listingState.fetchedListing.description}
                <br/>
                {this.renderPrice()}
                </Text>
              </Spoiler> :
              <Text mt={-40} style={{paddingTop: '55px'}} className="description" onClick={() => this.setEdit('description')}>{this.props.listingState.fetchedListing.description}
              <br/>
              {this.renderPrice()}
              </Text>
            }
          </>
        )
        
      } else {
        return(
          <Group mt='xl' direction="column" position="center">
            <Textarea name='description' placeholder={this.props.listingState.fetchedListing.description} radius='md' invalid={this.props.listingState.descriptionErr ? true : false} required value={this.props.listingState.fetchedListing.description} onChange={this.props.handleChange} />
            <NumberInput name='price' placeholder={this.props.listingState.fetchedListing.price.toString()} radius='md' invalid={this.props.listingState.priceErr ? true : false} required hideControls value={this.props.listingState.fetchedListing.price} onChange={this.props.handleNumber} />
          </Group>
        )
      }
    }

    renderPrice = () => {
      if (!this.state.editPrice) {
        return (
          <Center>
            <Badge mt={20} radius='lg' size="xl" onClick={() => this.setEdit('price')}>${this.props.listingState.fetchedListing.price} USD</Badge>
          </Center>
        )
      }
    }

    renderTags = () => {

    }
  
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
  if (this.state.newProfilePic && this.state.stringPrvwSrc !== '') {
    this.updateListingImage(this.state.stringPrvwSrc)
  } else {
    this.updateListingInfo();
  }
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

    await fetch(`${APIURL}/listing/edit/${this.state.listingID}`, {
      method: 'PUT',
      body: JSON.stringify({
        listing: {
          title: this.props.listingState.fetchedListing.title,
          description: this.props.listingState.fetchedListing.description,
          image: this.props.listingState.fetchedListing.image,
          price: this.props.listingState.fetchedListing.price,
          tag: this.props.listingState.fetchedListing.tag,
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
    .then(res => {
      if (this.state.responseCode === 400) {
        this.state._isMounted && this.setState({
          errorMessage: res.message
        })
      }
      this.state._isMounted && this.setState({
        file: '',
        previewSrc: '',
        stringPrvwSrc: '',
        editDescription: false,
        editPrice: false,
        editTags: false,
        editTitle: false,
        inputVisible: false,
        submitted: false,
      })
      this.props.fetchListing()
    })
    .catch(error => console.log(error))
}

updateListingInfo = async ():Promise<void> => {
  await fetch(`${APIURL}/listing/edit/${this.state.listingID}`, {
    method: 'PUT',
    body: JSON.stringify({
      listing: {
        title: this.props.listingState.fetchedListing.title,
        description: this.props.listingState.fetchedListing.description,
        image: this.props.listingState.fetchedListing.image,
        price: this.props.listingState.fetchedListing.price,
        tag: this.props.listingState.fetchedListing.tag,
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
  .then(res => {
    console.log(res)
    if (this.state.responseCode === 400) {
      this.state._isMounted && this.setState({
        errorMessage: res.message
      })
    }
    this.state._isMounted &&  this.setState({
      file: '',
      previewSrc: '',
      stringPrvwSrc: '',
      editDescription: false,
      editPrice: false,
      editTitle: false,
      editTags: false,
      inputVisible: false,
      submitted: false,
    })
    this.props.fetchListing()
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
      <Card radius='lg' className="listingCard">
        {this.renderTitle()}
        <Group spacing={5} position="center"> 
          <Text size="lg" sx={{color: '#379683', fontFamily: 'Open-Sans, sans-serif'}} align="center" variant="link" component={Link} to={`/user/${this.props.listingState.fetchedListing.userId}`}>{this.props.listingState.fetchedListing.user.firstName} {this.props.listingState.fetchedListing.user.lastName}</Text>
        </Group>
        <Center>
          <Card.Section>
            {this.renderImage()}
          </Card.Section>
        </Center>
        <Center>
          {this.renderDescription()}
        </Center>
        {this.state.inputVisible &&
          <Group mt='sm' position="center">
            <Button onClick={this.handleUpdate} className="formButton" size="sm" radius='md' compact loading={this.state.submitted && this.state.responseCode !== 201 ? true : false} >Save Changes</Button>
            <Button onClick={this.cancelEdit} className='formButton' size="sm" radius='md' compact>Cancel</Button>
          </Group>
        }
        <Group mt='lg' position="center">
          <Button className="formButton" size="lg" radius='md' compact onClick={() => console.log('delete')}>Delete</Button>
        </Group>
        {this.state.responseCode === 500 ?
          <Alert icon={<BsEmojiFrown/>} title='Sorry' color='red' radius='md' withCloseButton onClose={() => this.setState({responseCode: 0})}>Internal Error</Alert> :
        this.state.responseCode === 400 ?
          <Alert icon={<BsEmojiDizzy/>} title='Oops!' color='red' radius='md' withCloseButton onClose={() => this.setState({responseCode: 0})}>{this.state.errorMessage}</Alert> : ''
        }
        {this.props.app.dlt && <ConfirmDelete sessionToken={this.props.app.sessionToken} what={this.props.app.what} dlt={this.props.app.dlt} setDlt={this.props.app.setDlt} endpointID={this.props.app.endpointID} setEndpointID={this.props.app.setEndpointID} response={this.props.app.response} setResponse={this.props.app.setResponse}/>}
        {!localStorage.getItem('Authorization') && <Navigate to='/' replace={true} />}
        {this.props.app.response === 200 && <Navigate to='/listings' replace={true} />}
      </Card>
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