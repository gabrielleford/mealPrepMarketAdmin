import React, { ChangeEvent } from "react";
import APIURL from "../../helpers/environment";
import { Buffer } from "buffer";
import { Navigate } from "react-router-dom";
import { AppProps } from "../../../App";
import { BsCheck2, BsEmojiFrown} from 'react-icons/bs';
import { ImageUploadDiv, ImageInput, ImageUpload } from "./CreateElements";
import { Alert, Button, Center, Checkbox, Container, Grid, Group, Image, Input, NumberInput, Paper, Text, Textarea, Title } from '@mantine/core';

const lineBreakRegex: RegExp = /\n/g;

export type CreateState = {
  title: string,
  image: string,
  description: string,
  price: number | undefined,
  tags: string[],
  listingID: string,
  previewSrc: string | ArrayBuffer | null,
  stringPrvwSrc: string,
  titleErr: boolean,
  descriptionErr: boolean,
  priceErr: boolean,
  imageErr: boolean,
  responseCode: number,
  submitted: boolean,
  errorMessage: string,
  _isMounted: boolean,
}

type CreateProps = {
  sessionToken: AppProps['sessionToken'],
  setActive: AppProps['setActive'],
}

class CreateListing extends React.Component<CreateProps, CreateState> {
  constructor(props: CreateProps) {
    super(props)

    this.state = {
      title: '',
      image: '',
      description: '',
      price: undefined,
      tags: [],
      listingID: '',
      previewSrc: '',
      stringPrvwSrc: '',
      titleErr: false,
      descriptionErr: false,
      priceErr: false,
      imageErr: false,
      responseCode: 0,
      submitted: false,
      errorMessage: '',
      _isMounted: false,
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleTag = this.handleTag.bind(this);
    this.handleImage = this.handleImage.bind(this);
    this.previewImage = this.previewImage.bind(this);
    this.previewImgSrc = this.previewImgSrc.bind(this);
    this.handlePost = this.handlePost.bind(this);
    this.postListing = this.postListing.bind(this);
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value
    })

    const {name, value} = e.target;
    this.checkValue(name, value);
  }

  handleNumber = (value: number | undefined) => {
    this.setState({
      price: value
    })
  }

  checkValue = (name: string, value: string) => {
    switch (name) {
      case 'title': 
          value.length < 3 ? this.setState({
            titleErr: true
          }) : this.setState({
            titleErr: false
          })
        break;
      case 'description':
          value.length < 20 ? this.setState({
            descriptionErr: true
          }) : value.length > 2000 ? this.setState({
            descriptionErr: true
          }) : this.setState({
            descriptionErr: false
          })
        break;
      case 'price':
          +value < 1 ? this.setState({
            priceErr: true
          }) : +value > 999.99 ? this.setState({
            priceErr: true
          }) : this.setState({
            priceErr: false
          })
        break;
      }
    }

  handleTag = (e: React.ChangeEvent<HTMLInputElement>) => {
    let checkedTags:string[] = [...this.state.tags, e.target.id];
    if (this.state.tags.includes(e.target.id)) {
      checkedTags = checkedTags.filter(tag => tag !== e.target.id)
    }
    this.setState({
      tags: checkedTags
    })
  }

  handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      image: e.target.value
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
      stringPrvwSrc: Buffer.from(prvwFile).toString()
    })
  }
}

  handlePost = () => {
    this.setState({
      submitted: true,
    })
    this.postListing(this.state.stringPrvwSrc);
  }

  postListing = async (encodedImg: string):Promise<void> => {
    var formData = new FormData();
    formData.append('file', encodedImg);
    formData.append('upload_preset', 'MealPrepMarket');

    var res = await fetch(`https://api.cloudinary.com/v1_1/gabrielleford/image/upload`, {
      method: 'POST',
      body: formData,
    })
    var cloudinary = await res.json();

    await fetch(`${APIURL}/listing/create`, {
      method: "POST",
      body: JSON.stringify({
        listing: {
          title: this.state.title,
          description: this.state.description.replaceAll(lineBreakRegex, '\n'),
          image: cloudinary.url,
          price: this.state.price,
          tag: this.state.tags,
        },
      }),
      headers: new Headers({
        "Content-Type": "application/json",
        authorization: `Bearer ${this.props.sessionToken}`
      })
    })
    .then(res => {
      console.log(res);
      this.state._isMounted && this.setState({
        submitted: false,
        responseCode: res.status
      })
      return res.json();
    })
    .then(res => {
      console.log(res);
      if (this.state.responseCode === 400) {
        this.state._isMounted && this.setState({
          errorMessage: res.message
        })
      }
      if (this.state.responseCode === 201) {
        this.state._isMounted && this.setState({
          listingID: res.listing.id
        })
      }
    })
    .catch((error) => console.log(error))
  }

  componentDidMount(){
    this.props.setActive('empty')
    this.setState({
      _isMounted: true,
    })
  }

  componentDidUpdate(prevProps:Readonly<CreateProps>, prevState:Readonly<CreateState>){
    if(this.state.previewSrc !== prevState.previewSrc ) {
      this.previewImgSrc(this.state.previewSrc);
    }
  }

  componentWillUnmount() {
    this.setState({
      _isMounted: false
    })
  }
  
  render(): React.ReactNode {
    return (
      <Container mt={-90} size={600} padding='lg'>
        <Paper className='form' sx={{paddingTop: 40, paddingBottom: 40, paddingLeft: 75, paddingRight: 75}} mt='xl' shadow='xl' radius='md'>
          <Title align='center' className='formTitle' order={1}>Create New Listing</Title>
          <Grid gutter='lg'>
            <Grid.Col>
              <ImageUploadDiv>
                <ImageUpload htmlFor='image'>Choose Image</ImageUpload>
                <ImageInput type='file' id='image' onChange={this.handleImage} value={this.state.image} />
              </ImageUploadDiv>
              <Center>
                <Text size='xs' sx={{color: '#edf5e1'}}>{this.state.image.replace('C:\\fakepath\\', '')}</Text>
              </Center>
              {this.state.stringPrvwSrc && <Image width={400} height={250} src={this.state.stringPrvwSrc} />}
            </Grid.Col>
            <Grid.Col>
                <Input name='title' placeholder='Title' radius='md' invalid={this.state.titleErr ? true : false} required value={this.state.title} onChange={this.handleChange} />
            </Grid.Col>
            <Grid.Col>
              <Textarea name='description' placeholder="Description" radius='md' invalid={this.state.descriptionErr ? true : false} required value={this.state.description} onChange={this.handleChange} />
            </Grid.Col>
            <Grid.Col>
              <NumberInput name='price' placeholder="Price" radius='md' invalid={this.state.priceErr ? true : false} required hideControls value={this.state.price} onChange={this.handleNumber} />
            </Grid.Col>
            <Grid.Col>
              <Group position="center">
                <TagRender handleTag={this.handleTag} />
              </Group>
            </Grid.Col>
            <Grid.Col>
                <Center>
                  <Button className='formButton' radius='md' size='lg' compact loading={this.state.responseCode !== 201 && this.state.submitted ? true : false} onClick={this.handlePost}>Create Listing</Button>
                </Center>
              </Grid.Col>
              <Grid.Col>
                <Center>
                  {this.state.responseCode === 500 ?
                    <Alert icon={<BsEmojiFrown/>} title='Sorry' color='red' radius='md' withCloseButton onClose={() => this.setState({
                      responseCode: 0
                    })}>Internal Error</Alert> : 
                    this.state.responseCode === 400 ?
                    <Alert icon={<BsCheck2/>} title='Oops!' color='red' radius='md' withCloseButton onClose={() => this.setState({
                      responseCode: 0
                    })}>{this.state.errorMessage}</Alert> : ''
                  }
                </Center>
              </Grid.Col>
          </Grid>
        </Paper>
        {this.state.listingID !== '' ? 
        <Navigate to={`/listing/${this.state.listingID}`} replace={true} /> : 
        !localStorage.getItem('Authorization') ? 
        <Navigate to='/' replace={true} /> : ''
        }
      </Container>
    )
  }
}

export default CreateListing;

type TagProps = {
  handleTag: CreateListing['handleTag']
}

class TagRender extends React.Component<TagProps> {
  render(): React.ReactNode {
    return (
      <>
      <Group spacing='xs'>
        <label className="checkbox" htmlFor="Keto">Keto</label>
        <Checkbox id='Keto' sx={{color: '#edf5e1'}} onChange={this.props.handleTag} />
      </Group>
      <Group spacing='xs'>
        <label className="checkbox" htmlFor="Low Carb">Low Carb</label>
        <Checkbox id='Low Carb' onChange={this.props.handleTag} />
      </Group>
      <Group spacing='xs'>
        <label className="checkbox" htmlFor="Mediterranean">Mediterranean</label>
        <Checkbox id='Mediterranean' className="checkbox" onChange={this.props.handleTag} />
      </Group>
      <Group spacing='xs'>
        <label className="checkbox" htmlFor="Paleo">Paleo</label>
        <Checkbox id='Paleo' className="checkbox" onChange={this.props.handleTag} />
      </Group>
      <Group spacing='xs'>
        <label className="checkbox" htmlFor="Vegan">Vegan</label>
        <Checkbox id='Vegan' className="checkbox" onChange={this.props.handleTag} />
      </Group>
      <Group spacing='xs'>
        <label className="checkbox" htmlFor="Vegetarian">Vegetarian</label>
        <Checkbox id='Vegetarian'className="checkbox" onChange={this.props.handleTag} />
      </Group>
      <Group spacing='xs'>
        <label className="checkbox" htmlFor="Dairy Free">Dairy Free</label>
        <Checkbox id='Dairy Free' className="checkbox" onChange={this.props.handleTag} />
      </Group>
      <Group spacing='xs'>
        <label className="checkbox" htmlFor="Egg Free">Egg Free</label>
        <Checkbox id='Egg Free' className="checkbox" onChange={this.props.handleTag} />
      </Group>
      <Group spacing='xs'>
        <label className="checkbox" htmlFor="Gluten Free">Gluten Free</label>
        <Checkbox id='Gluten Free' className="checkbox" onChange={this.props.handleTag} />
      </Group>
      <Group spacing='xs'>
        <label className="checkbox" htmlFor="Nut Free">Nut Free</label>
        <Checkbox id='Nut Free' className="checkbox" onChange={this.props.handleTag} />
      </Group>
      <Group spacing='xs'>
        <label className="checkbox" htmlFor="Soy Free">Soy Free</label>
        <Checkbox id='Soy Free' className="checkbox" onChange={this.props.handleTag} />
      </Group>
      <Group spacing='xs'>
        <label className="checkbox" htmlFor="Sugar Free">Sugar Free</label>
        <Checkbox id='Sugar Free' className="checkbox" onChange={this.props.handleTag} />
      </Group>
      </>
    )
  }
}