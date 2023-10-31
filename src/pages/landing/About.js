import { Avatar, Box, Flex, Heading, Link, Text } from "@chakra-ui/react";
import Footer from "./Footer";
import Navbar from "./Navbar";

import bhada from "../../assets/bhada.jpg";
import emily from "../../assets/emily.jpeg";
import hammad from "../../assets/hammad.jpeg";

const AvatarLink = ({ src, alt, name, marginYes, to }) => {
    return (
        <Box mt={"5px"} mx={(marginYes ? { base: "1.2rem", sm: "2.2rem" } : "none")} alignSelf={"center"}>
            <a href={to} target="_blank" rel="noopener noreferrer">
                <Link>
                    <Avatar
                        src={src}
                        alt={alt}
                        height={{ base: '92px', sm: '140px' }}
                        width={{ base: '92px', sm: '140px' }}
                        cursor="pointer"
                        transition="all 0.2s ease-in-out"
                        boxShadow='0 5px 15px rgba(0, 0, 0, 0.2)'
                        _hover={{
                            transform: 'scale(0.95)',
                            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
                        }}
                    />
                </Link>
            </a>
            <Text
                mt={1}
                px={-4}
                mx={-4}
                fontSize={{ base: '15px', sm: '20px' }}
                fontWeight="semibold"
                align="center"
                textAlign="center"
            >
                {name}
            </Text>
        </Box>
    );
};

function About() {
    return (
        <Flex bg={"#fff2db"} direction="column" minHeight="100vh">
            <Navbar toneDownShadow={true} />

            <Flex direction="column" alignItems="center" justifyContent="center" mt="5rem" mb={"2rem"} flex="1">
                <Heading as="h1" fontSize="38px" textAlign="center" mb="2rem">
                    About Us
                </Heading>
                <Text fontSize={"22px"} style={{ margin: "0 1.5rem", marginBottom: "2rem" }}>
                    We are a group of UC Berkeley students interested in User Interface Design & Development and Human-Computer Interaction (HCI).
                    Our team met during Spring of 2023 while taking CS 160, and since then, we have been working on Timeless Treasures,
                    an exciting project that we believe is the solution to a significant issue we notice within the current Digital Age.
                </Text>

                <Flex justifyContent="center" mb="1rem">
                    <AvatarLink
                        marginYes={false}
                        src={bhada}
                        alt="Bhada Yun"
                        name="Bhada Yun"
                        to="https://www.linkedin.com/in/bhadayun/"
                    />
                    <AvatarLink
                        marginYes={true}
                        src={emily}
                        alt="Emily Lee"
                        name="Emily Lee"
                        to="https://www.linkedin.com/in/emily-k-lee/"
                    />
                    <AvatarLink
                        marginYes={false}
                        src={hammad}
                        alt="Hammad Afzal"
                        name="Hammad Afzal"
                        to="https://www.linkedin.com/in/hammadafzal887/"
                    />
                </Flex>

                <Flex alignItems="flex-start" flexDirection="column">
                    <Heading as="h2" fontSize="32px" mb="1rem" fontWeight="bold" ml="1.5rem">
                        Our Mission
                    </Heading>
                    <Text fontSize={"22px"} style={{ margin: "0 1.5rem", marginBottom: "2rem" }}>
                        Despite an aging population, senior citizens are often overlooked within the context of technological innovation and design. Through our interviews
                        with senior citizens, we realized that many social media apps with older demographics have overly complex user interfaces as well
                        as questionable data harvesting and privacy policies. Despite this, they had various recipes, stories, and wisdom they wished
                        to offer the internet community, but feel like social media apps just aren't "made for them." This is an issue that may affect everyone,
                        especially as technological literacy aside, various physical conditions such as visual and motor impairments are inevitable aspects of aging
                        for <b>all</b> of us.
                    </Text>
                    <Text fontSize={"22px"} style={{ margin: "0 1.5rem", marginBottom: "2rem" }}>
                        In response, we created Timeless Treasures, a <b>senior creator first</b> app, where accessible & approachable UI is a top priority. As you browse
                        through the site, you will notice our various design choices such as bigger font sizes, streamlined instructions, and our own chatbot, Maya, to
                        give personalized guidance. With Timeless Treasures, personalized accessibility is not a secondary option, it is a requirement.
                    </Text>
                    <Text fontSize={"22px"} style={{ margin: "0 1.5rem" }}>
                        We hope that as our app evolves, everyone, from grandparents and grandchildren to teachers and students may have a chance to share the treasures that truly
                        matter: <i>the memories and experiences that we collect throughout our lives.</i>
                    </Text>
                </Flex>

                <Flex mt="2em" alignItems="flex-start" flexDirection="column">
                    <Heading as="h2" fontSize="32px" mb="1rem" fontWeight="bold" ml="1.5rem">
                        Our Design Story
                    </Heading>
                    <Text fontSize={"22px"} style={{ margin: "0 1.5rem", marginBottom: "2rem" }}>
                        As a team, we first started with brainstorming ideas. Starting with over 75 ideas that we wrote on a chalkboard, we wanted to find a novel idea that
                        would serve an underrepresented target group. After much discussion, we decided to create an app that would help senior citizens store their memories, 
                        recipes, and knowledge so that future generations could benefit from their wisdom.
                    </Text>
                    <Text fontSize={"22px"} style={{ margin: "0 1.5rem", marginBottom: "2rem" }}>
                        We devised a collaborative plan and performed thorough task and competitive analysis, going to grocery stores and libraries
                        for contextal inquiry before creating multiple prototypes. After rounds of heuristic analysis, development phase began, in which 
                        we were able to create nearly 80% of the core functionalities all within 1 week. But for all the time spent on developing functionalities,
                        we spent even more time focusing on accessibility. 
                    </Text>
                    <Text fontSize={"22px"} style={{ margin: "0 1.5rem", marginBottom: "1rem" }}>
                        As we continue to develop our app in collaboration alongside our local community seniors, we hope to fulfill our mission and help bridge the 
                        both the social & technological generational divide of internet communication. Furthermore, by attending conferences and submitting papers on our project,
                        we hope to bring our target group to the light, hopefully promoting further HCI research to an underserved group within creative spheres.
                    </Text>
                </Flex>
            </Flex>
            <Footer />
        </Flex>
    );
}

export default About;
