import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { baseUrl } from "../../../../config";
import { useSelector } from "react-redux";
import parse from "html-react-parser";
import Rating from "@mui/material/Rating";
import { Box, Button, IconButton, TextField } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import Link from "next/link";

import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";

export default function ProductDetailInfoTab({ original, data, setRender }) {
  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));

  const [openReview, setOpenReview] = React.useState(false);
  const handleClickOpen = () => {
    setOpenReview(true);
  };
  const handleClose = () => {
    setOpenReview(false);
  };

  const [hover, setHover] = React.useState(-1);
  const { register, handleSubmit, errors, reset } = useForm();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [desc, setDesc] = useState("");
  const isAuthenticated = useSelector((state) => state.userReducer);

  const [rating, setRating] = React.useState(1);
  const [rating_description, setRating_description] = React.useState("");

  const router = useRouter();
  const { slug } = router.query;
  const [show, setShow] = useState(false);
  const [reviewid, setReviewid] = useState("");

  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  console.log("render", setRender);

  const submitReview = async () => {
    if (!isAuthenticated?.isAuthenticated) {
      return toast.error("For Submiting Please Login !!");
    }

    console.log(data);
    if (rating_description.length < 10) {
      return toast.error("Write Atleast 10 Characters !!");
    }
    try {
      const response = await axios.post(
        `${baseUrl}/api/website/front/product/add-review/${data.productID}`,
        {
          user_id: isAuthenticated.user.user.user_id,
          username: isAuthenticated.user.user.username,
          rating: rating,
          rating_description: rating_description,
        },
        {
          withCredentials: true,
        }
      );

      // Handle a successful review submission here, e.g., show a success message or refresh the review section
      setRating_description("");
      setRating(1);
      toast.success("Thank you For Your Review !!");

      setRender.setRender(!setRender.render);
      console.log(response.data.message);
      setReviewSubmitted(!reviewSubmitted);
      // Reset the form after submission
      // reset();
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  // Add a useEffect hook to watch for changes in the reviewSubmitted state
  useEffect(() => {
    if (reviewSubmitted) {
      console.log("Review submitted successfully. Triggering a re-render.");
    }
  }, [reviewSubmitted]);

  // Function to toggle show/hide full description
  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const truncatedDescription = showFullDescription
    ? data?.description // Show full description if showFullDescription is true
    : data?.description?.slice(0, 200); // Show the first 200 characters if showFullDescription is false

  const onEditReview = async (formData) => {
    const { desc } = formData;

    try {
      const response = await axios.put(
        `${baseUrl}/api/website/front/product/edit-review`, // Update with your API endpoint
        { desc: desc, productId: slug, reviewId: reviewid }, // Send review data to the server
        {
          withCredentials: true,
        }
      );

      // Handle a successful review submission here, e.g., show a success message or refresh the review section
      console.log(response.data.message);
      setReviewSubmitted(!reviewSubmitted);
      toast.success(response.data.message);
      window.location.reload();
      // Reset the form after submission
      reset();
    } catch (error) {
      // Handle errors, e.g., display an error message to the user
      console.error("Error submitting review:", error);
      toast.error(error);
    }
  };

  const onSubmitReview = async (formData) => {
    const { message } = formData;

    try {
      const response = await axios.post(
        `${baseUrl}/api/website/front/product/add-review/${slug}`, // Update with your API endpoint
        { desc: message }, // Send review data to the server
        {
          withCredentials: true,
        }
      );

      // Handle a successful review submission here, e.g., show a success message or refresh the review section
      console.log(response.data.message);
      setReviewSubmitted(!reviewSubmitted);
      toast.success(response.data.message);
      window.location.reload();
      // Reset the form after submission
      reset();
    } catch (error) {
      // Handle errors, e.g., display an error message to the user
      console.error("Error submitting review:", error);
      toast.error(error);
    }
  };
  const labels = {
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
  };
  function getLabelText(value) {
    return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
  }

  return (
    <div className="product-detail__tab mt-4">
      <h5 className="product_description_heading">Product Description</h5>
      <div className="product_description_para productDescription">
        {parse(data?.description ? data?.description : "")}
      </div>
      <Tabs className="product-detail__tab__content d-flex">
        <div
          className="row w-100"
          style={{ marginRight: "0", marginLeft: "0", marginTop: "20px" }}
        >
          <div
            className="col-12 col-sm-12 col-md-6 col-lg-6 Review_mainRow"
            style={{ width: "50%" }}
          >
            <h3 className="ratingtext product_description_heading mt-5 mb-2">
              Submit Review
            </h3>
            <div className="maincard">
              <div className="maindetails">
                <div className="img_text">
                  <div className="img_card"></div>
                </div>
                <div className="center_line"></div>
                <p className="ratingtext form">Your Rating *</p>
                <div className="ratingarrage">
                  <div>
                    <Rating
                      name="hover-feedback"
                      value={rating}
                      precision={1}
                      size="large"
                      onChange={(event, newValue) => {
                        setRating(newValue);
                      }}
                      onChangeActive={(event, newHover) => {
                        // setHover(newHover);
                      }}
                      emptyIcon={
                        <StarIcon
                          style={{ opacity: 0.55 }}
                          fontSize="inherit"
                        />
                      }
                    />
                  </div>

                  {/* <div>
                    {" "}
                    {rating !== null && (
                      <Box sx={{ ml: 2 }}>
                        {labels[hover !== -1 ? hover : rating]}/5
                      </Box>
                    )}
                  </div> */}
                </div>
                <label className="ratingtext form">Write Your Review *</label>
                <div className="your_review mt-3">
                  <textarea
                    id="outlined-multiline-static"
                    className="textArea"
                    placeholder="Type Message...."
                    // label="Your Review"
                    value={rating_description}
                    onChange={(e) => setRating_description(e.target.value)}
                    multiline
                    rows={7}
                    style={{ width: "100%" }}
                  ></textarea>
                </div>
                {/* <div className="name_email">
              <TextField label="Enter Your Name" className="nameclass" />
              <TextField label="Enter Your Email" className="emailclass" />
            </div> */}
                <button
                  className="btn -red reviewbtn mt-3"
                  onClick={() => submitReview()}
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>

          {data?.product_review?.length <= 0 ? (
            ""
          ) : (
            <div className="Review_mainRow review_less col-12 col-sm-12 col-md-6 col-lg-6">
              <h3 className="product_description_heading ratingtext mt-5 mb-2">
                Recent Reviews
              </h3>
              <div
                className="row w-100"
                style={{ marginRight: "0", marginLeft: "0", marginTop: "20px" }}
              >
                {data?.product_review?.slice(-3)?.map((rat, index) => (
                  <div className="allcard_rating w-100">
                    <div className="ratingcard w-100">
                      <div className="leftright_start">
                        <div className="left_right">
                          <div className="rightside">
                            <div
                              className="img mb-0 w-25"
                              style={{
                                borderRadius: "50px",
                                maxWidth: "60px",
                                overflow: "hidden",
                              }}
                            >
                              <img
                                className="review_user_img"
                                src="/userimg.png"
                              />
                            </div>
                            <div className="nameanddate">
                              <div className="username">
                                <p>
                                  <b>{rat?.username}</b>
                                </p>
                              </div>
                              <div className="dateandstart">
                                <div className="userdate">
                                  <p>{rat?.created_at}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="startab">
                          <Rating
                            name="read-only"
                            value={rat?.rating}
                            readOnly
                            size={"23"}
                          />
                        </div>
                      </div>
                      <div className="centerline"></div>
                      <div className="detailsreview">
                        <p>{rat?.rating_description}</p>
                      </div>
                    </div>
                  </div>
                ))?.reverse()}
              </div>

              <div
                className="button-37 p-0"
                onClick={handleClickOpen}
                style={{ textAlign: "right", justifyContent: "end" }}
              >
                View All
              </div>
            </div>
          )}
        </div>

        {/* <div
          className="img mb-0 w-25"
          style={{
            borderRadius: "50px",
            maxWidth: "60px",
            overflow: "hidden",
          }}
        >
          <img
            className="m-0 w-100"
            src="https://firebasestorage.googleapis.com/v0/b/hopequrelms.appspot.com/o/education_images%2Ftestimonials-images%2F1703056378751_pngtree-the-female-teacher-with-glasses-is-in-class-picture-image_1716160%20(1).jpg?alt=media&token=12054762-0912-4050-8213-4fdd4eebb03b"
          />
        </div>
        <div
          className="d-flex w-75"
          style={{ flexDirection: "column", justifyContent: "center" }}
        >
          <div>
            <h6 className="mb-0 p-0 d-flex ">Professor</h6>
            <div className=" mb-2 ">
              <p className="m-0">Rahul</p>
            </div>
          </div>

          <div className="testimonial__text px-4 mt-4 mb-4">
            my name is rahul and....{" "}
          </div>
        </div> */}

        {/* <TabList className="tab__content__header">
        
        </TabList> */}

        {/* <TabPanel className="tab__content__item -description">
          <p>
           <div>
           {parse(truncatedDescription)}
           </div>
            
            {data?.description?.length > 200 && (
              <button
                style={{
                  border: "none",
                  background: "none",
                  color: "green",
                }}
                onClick={toggleDescription}
              >
                {showFullDescription ? "Show Less" : "Show More"}
              </button>
            )}
            </p>
        </TabPanel> */}

        {/* <TabPanel className="tab__content__item -review">
          {original?.review?.map((item) => {
            return (
              <>
                <Review
                  name={item?.username}
                  publicDate={item?.createdAt}
                  productID={slug}
                  id={item?._id}
                  user={item?.userID}
                  show={show}
                  setShow={setShow}
                  desc={desc}
                  setDesc={setDesc}
                  reviewid={reviewid}
                  setReviewid={setReviewid}
                >
                  {item?.desc}
                </Review>
              </>
            );
          })}
          {!isAuthenticated ? (
            <>
              <span
                style={{
                  fontWeight: "bold",
                  color: "red",
                }}
              >
                To review a product please login...
              </span>
            </>
          ) : (
            <>
              {show ? (
                <>
                  <form onSubmit={handleSubmit(onEditReview)}>
                    <h5>Edit your review</h5>
                    <div className="col-12">
                      <div className="input-validator">
                        <textarea
                          name="desc"
                          placeholder="description"
                          rows="5"
                          value={desc || ""}
                          onChange={(e) => {
                            setDesc(e.target.value);
                          } }
                          required
                          ref={register({
                            required: "Review message is required",
                          })}
                        />
                      </div>
                      {errors.message && (
                        <span className="input-error">
                          {errors.message.message}
                        </span>
                      )}
                    </div>
                    <div className="col-12">
                      <button className="btn -dark" type="submit">
                        submit 
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <form onSubmit={handleSubmit(onSubmitReview)}>
                  <h5>write a review</h5>
                  <div className="col-12">
                    <div className="input-validator">
                      <textarea
                        name="message"
                        placeholder="Message"
                        rows="5"
                        required
                        ref={register({
                          required: "Review message is required",
                        })}
                      />
                    </div>
                    {errors.message && (
                      <span className="input-error">
                        {errors.message.message}
                      </span>
                    )}
                  </div>
                  <div className="col-12">
                    <button className="btn -dark" type="submit">
                      Write a review
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </TabPanel> */}
      </Tabs>

      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={openReview}
        sx={{ zIndex: 9999999999 }}
      >
        <h3 id="customized-dialog-title" className="popup_allReviews heading">
          All Reviews
        </h3>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 35,
            top: 25,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent style={{ padding: "30px" }}>
          {data?.product_review?.map((rat, index) => (
            <div className="allcard_rating w-100 popupCardReview">
              <div className="ratingcard w-100">
                <div className="leftright_start">
                  <div className="left_right">
                    <div className="rightside">
                      <div
                        className="img mb-0 w-25"
                        style={{
                          borderRadius: "50px",
                          maxWidth: "60px",
                          overflow: "hidden",
                        }}
                      >
                        <img className="review_user_img" src="/userimg.png" />
                      </div>
                      <div className="nameanddate">
                        <div className="username">
                          <p>
                            <b>{rat?.username}</b>
                          </p>
                        </div>
                        <div className="dateandstart">
                          <div className="userdate">
                            <p>{rat?.created_at}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="startab">
                    <Rating
                      name="read-only"
                      value={rat?.rating}
                      readOnly
                      size={"23"}
                    />
                  </div>
                </div>
                <div className="centerline"></div>
                <div className="detailsreview">
                  <p>{rat?.rating_description}</p>
                </div>
              </div>
            </div>
          ))?.reverse()}
        </DialogContent>
        {/* <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Save changes
          </Button>
        </DialogActions> */}
      </BootstrapDialog>
    </div>
  );
}

{
  /* <TabPanel className="tab__content__item -ship">
          <h5>
            <span>Ship to </span>New York
          </h5>
          <ul>
            <li>
              Standard Shipping on order over 0kg - 5kg. <span>+10.00</span>
            </li>
            <li>
              Heavy Goods Shipping on oder over 5kg-10kg . <span>+20.00</span>
            </li>
          </ul>
          <h5>Delivery & returns</h5>
          <p>
            We diliver to over 100 countries around the word. For full details
            of the delivery options we offer, please view our Delivery
            information.
          </p>
        </TabPanel> */
}
