import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Axios from "axios";
import { detailsProduct, updateProduct } from "../actions/productActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { PRODUCT_UPDATE_RESET } from "../constants/productConstants";

// Aqui
import DayPickerInput from 'react-day-picker/DayPickerInput'
import { DateUtils } from 'react-day-picker'
import dateFnsFormat from 'date-fns/format'
import dateFnsParse from 'date-fns/parse'

import MomentLocaleUtils, {
  formatDate,
  parseDate
} from 'react-day-picker/moment';

import "react-day-picker/lib/style.css";

//Aqui

export default function ProductEditScreen(props) {
  const productId = props.match.params.id;
  const [name, setName] = useState("");
  const [priceVal, setPriceVal] = useState("");
  const [priceEuro, setPriceEuro] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [section, setSection] = useState("");
  const [isService, setIsService] = useState(false);
  const [auxPhone, setAuxPhone] = useState("");
  const [delivery, setDelivery] = useState("");
  const [expiry, setExpiry] = useState("");
  const [pause, setPause] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [image, setImage] = useState([]);
  const [isGift, setIsGift]= useState("")

  // Aqui
  function parseDate(str, format, locale) {
    const parsed = dateFnsParse(str, format, new Date(), { locale });
    //console.log(parsed)
    if (DateUtils.isDate(parsed)) {
      return parsed
    }
    return undefined
  }

  function formatDate(date, format, locale) {
    return dateFnsFormat(date, format, { locale })
  }

  const GetFormattedDate = (expiry) => {
    console.log( typeof expiry)
    if (typeof expiry === 'object') {
      var day = expiry.getDate()
      var month = expiry.getMonth() + 1
      var year = expiry.getFullYear()
      //console.log(`${day}/${month}/${year}`)
      //setExpiry(`${day}/${month}/${year}`)

      var expDate = new Date(expiry)
    var curDate = new Date()
    if (expiry === null) {
      setPause(false);
      console.log('a')
    } 

    if (curDate.getTime() < expDate.getTime()) {
      setPause(false)
      console.log("here1")
    } else {
      setPause(true)
      console.log('here2')
    }

      setExpiry(expiry)
    }
  }
  const CalFORMAT = 'dd/MM/yyyy'
  // Aqui

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;

  const dispatch = useDispatch();
  useEffect(() => {
    window.scrollTo(0, 0);
    if (successUpdate) {
      props.history.push("/productlist/seller");
    }
    if (!product || product._id !== productId || successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      dispatch(detailsProduct(productId));
    } else {
      setName(product.name);
      setPriceVal(product.priceVal);
      setPriceEuro(product.priceEuro);
      setImage(product.image);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setBrand(product.brand);
      setDescription(product.description);
      setSection(product.section);
      setIsService(product.isService);
      setAuxPhone(product.auxPhone);
      setDelivery(product.delivery);
      
      //aqui

      var expDate = new Date(product.expiry)
      setExpiry(product.expiry);
      var curDate = new Date()

      if (product.expiry === null) {
        setPause(false);
        console.log('a')
      } 

      if (curDate.getTime() < expDate.getTime()) {
        setPause(false)
        console.log("here1")
      } else {
        setPause(true)
        console.log('here2')
      }
      console.log(product.pause)

      setCountry(product.country);
      setState(product.state);
      setCity(product.city);
      setIsGift(product.isGift);
      setMunicipality(product.municipality);
    }
  }, [product, dispatch, productId, successUpdate, props.history]);
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        _id: productId,
        name,
        priceVal,
        priceEuro,
        image,
        category,
        brand,
        countInStock,
        description,
        section,
        isService,
        isGift,
        pause,
        auxPhone,
        delivery,
        expiry,
        country,
        state,
        city,
        municipality,
      })
    );
  };

  const [loadingUpload, setLoadingUpload] = useState(false);
  const [errorUpload, setErrorUpload] = useState("");

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const uploadFileHandler = async (e) => {
    const position = e.target.id;
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("image", file);
    setLoadingUpload(true);
    try {
      const { data } = await Axios.post("/api/uploads/s3", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      if (position === "imageFile") {
        setImage([data, image[1], image[2], image[3], image[4], image[5]]);
      }
      if (position === "imageFile2") {
        setImage([image[0], data, image[2], image[3], image[4], image[5]]);
      }
      if (position === "imageFile3") {
        setImage([image[0], image[1], data, image[3], image[4], image[5]]);
      }
      if (position === "imageFile4") {
        setImage([image[0], image[1], image[2], data, image[4], image[5]]);
      }
      if (position === "imageFile5") {
        setImage([image[0], image[1], image[2], image[3], data, image[5]]);
      }
      if (position === "imageFile6") {
        setImage([image[0], image[1], image[2], image[3], image[4], data]);
      }
      setLoadingUpload(false);
    } catch (error) {
      setErrorUpload(error.message);
      setLoadingUpload(false);
    }
    console.log(image);
  };

  const setDefaultImage = (e) => {
    if (e === "servizio") setIsService(true);
    if (e === "prodotto") setIsService(false);
    setImage([`/images/${section}_${e}.jpg`]);
  };

  const helpSetDefaultImage = (e) => {
    if (e === "offro") setSection("offro");
    if (e === "cerco") setSection("cerco");
    if (e === "propongo") {
      setSection("propongo");
      setImage(["/images/propongo.jpg"]);
    }
    if (e === "avviso") {
      setSection("avviso");
      setImage(["/images/avviso.jpg"]);
    }
    if (e === "dono") {
      setSection("dono");
      setImage(["/images/avviso.jpg"]);
    }
    if (e === "offro" && isService) setImage(["/images/offro_servizio.jpg"]);
    if (e === "offro" && !isService) setImage(["/images/offro_prodotto.jpg"]);
    if (e === "cerco" && isService) setImage(["/images/cerco_servizio.jpg"]);
    if (e === "cerco" && !isService) setImage(["/images/cerco_prodotto.jpg"]);

    /* dono */
    if (e === 'dono' && isService) setImage(['/images/avviso.jpg']);
    if (e === 'dono' && !isService) setImage(['/images/avviso.jpg']);
    if (e === 'dono') setPriceVal(0)
  };

  const handleTitle = (e) => {
    const { value, maxLength } = e.target;
    const title = value.slice(0, maxLength);
    setName(title);
  };

  const infoText =
    " Compila tutti i campi obbligatori contrassegnati da un (*)." +
    " Prima e dopo la pubblicazione potrai comunque rivedere e modificare il tuo annuncio." +
    " Se rispetta le consuete normative, il tuo annuncio, sarà pubblicato.";

  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div className="flash">
          <h1 className="row center">Crea / Modifica Annuncio N°:</h1>
          <p className="row center"> {productId}</p>
          {!userInfo.hasAd && (
            <MessageBox variant="alert">{infoText}</MessageBox>
          )}
        </div>
        {loadingUpdate && <LoadingBox></LoadingBox>}
        {errorUpdate && <MessageBox variant="danger">{errorUpdate}</MessageBox>}
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <div>
              <label htmlFor="section">Tipo annuncio</label>
              <select
                id="section"
                name="section"
                value={section.toString()}
                onChange={(e) => helpSetDefaultImage(e.target.value)}
              >
                <option value="offro">Offro</option>
                <option value="cerco">Cerco</option>
                <option value="propongo">Proposte di idee e progetti</option>
                <option value="avviso">Avviso</option>
                <option value="dono">Dono</option>
              </select>
            </div>
            {section !== "avviso" && section !== "propongo" && (
              <div>
                <label htmlFor="isService">
                  <input
                    type="radio"
                    id="kindof"
                    name="isService"
                    defaultChecked
                    onClick={(e) => setDefaultImage("prodotto")}
                  />
                  Prodotto
                </label>
                <label htmlFor="isService">
                  <input
                    type="radio"
                    id="kindof2"
                    name="isService"
                    onClick={(e) => setDefaultImage("servizio")}
                  />
                  Servizio
                </label>
              </div>
            )}
            <div>
              <label htmlFor="name">
                {section !== "propongo" ? "Titolo" : "Argomento"} *
              </label>
              <input
                id="name"
                type="text"
                maxLength="90"
                placeholder="Inserisci tuo gruppo - Descrizione breve del prodotto o servizio - Provincia."
                value={!name.match(/Annunciø/) ? name : ""}
                onChange={(e) => handleTitle(e)}
              ></input>
            </div>
            <div>
              <label htmlFor="category">Categoria *</label>
              <input
                id="category"
                type="text"
                placeholder="Inserisci categoria"
                value={category ? category.toUpperCase() : ""}
                onChange={(e) => setCategory(e.target.value.toUpperCase())}
                required
              ></input>
            </div>
            {/* dono */}
            {/* priceval in these cases should be 0*/}
            {/* value={priceVal} */}
            {section !== "avviso" && section !== "propongo" && section !== "dono" && (
              <>
                <div>
                  <label htmlFor="priceVal">Prezzo in Val </label>
                  <input
                    id="priceVal"
                    type="number"
                    placeholder="Inserisci prezzo ☯"
                    value={priceVal}
                    onChange={(e) => setPriceVal(e.target.value)}
                  ></input>
                </div>
                <div>
                  <label htmlFor="priceEuro">Prezzo in Euro </label>
                  <input
                    id="priceEuro"
                    type="number"
                    placeholder="Inserisci prezzo 💶"
                    value={priceEuro}
                    onChange={(e) => setPriceEuro(e.target.value)}
                  ></input>
                </div>
              </>
            )}
            {
              <div>
                <div>Immagini</div>
                <div className="row">
                  <img
                    src={image[0]}
                    alt="Product preview"
                    className="product_edit_img"
                  />
                  {image[1] ? (
                    <img
                      src={image[1]}
                      alt="Product preview"
                      className="product_edit_img"
                    />
                  ) : (
                    <div></div>
                  )}
                  {image[2] ? (
                    <img
                      src={image[2]}
                      alt="Product preview"
                      className="product_edit_img"
                    />
                  ) : (
                    <div></div>
                  )}
                </div>
                {image[3] && (
                  <div className="row">
                    <img
                      src={image[3]}
                      alt="Product preview"
                      className="product_edit_img"
                    />
                    {image[4] ? (
                      <img
                        src={image[4]}
                        alt="Product preview"
                        className="product_edit_img"
                      />
                    ) : (
                      <div></div>
                    )}
                    {image[5] ? (
                      <img
                        src={image[5]}
                        alt="Product preview"
                        className="product_edit_img"
                      />
                    ) : (
                      <div></div>
                    )}
                  </div>
                )}
                {loadingUpload && <LoadingBox></LoadingBox>}
                {errorUpload && (
                  <MessageBox variant="danger">{errorUpload}</MessageBox>
                )}
              </div>
            }
            <div>
              <label htmlFor="imageFile">Immagine File (max. 6 immagini)</label>
              <input
                type="file"
                id="imageFile"
                className="image_input"
                accept="image/png, image/jpeg"
                onChange={uploadFileHandler}
              ></input>
              {image.length > 1 ? (
                <input
                  type="file"
                  id="imageFile2"
                  className="image_input"
                  accept="image/png, image/jpeg"
                  onChange={uploadFileHandler}
                ></input>
              ) : (
                ""
              )}
              {image[1] ? (
                <input
                  type="file"
                  id="imageFile3"
                  className="image_input"
                  accept="image/png, image/jpeg"
                  onChange={uploadFileHandler}
                ></input>
              ) : (
                ""
              )}
              {image[2] ? (
                <input
                  type="file"
                  id="imageFile4"
                  className="image_input"
                  accept="image/png, image/jpeg"
                  onChange={uploadFileHandler}
                ></input>
              ) : (
                ""
              )}
              {image[3] ? (
                <input
                  type="file"
                  id="imageFile5"
                  className="image_input"
                  accept="image/png, image/jpeg"
                  onChange={uploadFileHandler}
                ></input>
              ) : (
                ""
              )}
              {image[4] ? (
                <input
                  type="file"
                  id="imageFile6"
                  className="image_input"
                  accept="image/png, image/jpeg"
                  onChange={uploadFileHandler}
                ></input>
              ) : (
                ""
              )}
            </div>
            {section !== "avviso" && (
              <div>
                <label htmlFor="brand">Parola chiave </label>
                <input
                  id="brand"
                  type="text"
                  placeholder="Classifica con una parola chiave"
                  value={brand ? brand.toUpperCase() : ""}
                  onChange={(e) => setBrand(e.target.value.toUpperCase())}
                ></input>
              </div>
            )}
            {section !== "avviso" && (
              <div>
                <label htmlFor="countInStock">
                  Numero prodotti in magazzino
                </label>
                <input
                  id="countInStock"
                  type="text"
                  placeholder="Inserisci numero di prodotti in offerta"
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                ></input>
              </div>
            )}
            <div>
              <label htmlFor="city">Città</label>
              <input
                id="city"
                type="text"
                placeholder={
                  city === "_" || section === "offro" || section === "cerco"
                    ? "Inserisci il nome della città dove si trova il " +
                      (isService ? "servizio" : "prodotto")
                    : "Inserisci il nome della città da dove parte " +
                      (section === "propongo" ? "la propuesta" : "l'avviso")
                }
                value={city !== "_" ? city : ""}
                onChange={(e) => setCity(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="auxPhone">
                Telefono di conttato per questo annuncio
              </label>
              <input
                id="auxPhone"
                type="text"
                placeholder={
                  parseInt(userInfo.phone) ||
                  "Inserisci numero di telefono per conttato"
                }
                value={auxPhone}
                onChange={(e) => setAuxPhone(e.target.value)}
              ></input>
            </div>
            {section !== "avviso" && (
              <div>
                <label htmlFor="delivery">Forma di consegna</label>
                <select
                  id="delivery"
                  name="delivery"
                  value={delivery}
                  onChange={(e) => setDelivery(e.target.value)}
                >
                  <option value="no preferences">Da concordare</option>
                  <option value="personalmente">Personalmente</option>
                  <option value="posta">Posta</option>
                  <option value="corriere">Corriere</option>
                </select>
              </div>
            )}

            <div>
              <label htmlFor="expiry">Data di scadenza annuncio*</label>
              {/*<DayPickerInput
                parseDate={parseDate}
                format={CalFORMAT}
                formatDate={formatDate}
                value={expiry}
                placeholder={`${dateFnsFormat(new Date(), CalFORMAT)}`}
                onDayChange={(e)=>GetFormattedDate(e)}
              />*/}
              <DayPickerInput
                formatDate={formatDate}
                format={CalFORMAT}
                parseDate={parseDate}
                placeholder={`${dateFnsFormat(new Date(), CalFORMAT)}`}
                onDayChange={(e) => GetFormattedDate(e)}
                value={expiry}
              />


            </div> 

            <div>
              <label htmlFor="description">Descrizione</label>
              <textarea
                id="description"
                rows="3"
                type="text"
                placeholder={
                  "Descrivi con precisione " +
                  (section === "offro" || section === "cerco"
                    ? isService
                      ? "il servizio"
                      : "il prodotto"
                    : section === "avviso"
                    ? "l'avviso"
                    : "la proposta")
                }
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div>
              <div>Disattiva annuncio temporaneamente</div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={pause}
                  onClick={(e) => setPause(!pause)}
                />
                <span className="slider round"></span>
              </label>
            </div>
            <div>
              <label></label>
              <button className="primary blu" type="submit">
                Aggiorna
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}