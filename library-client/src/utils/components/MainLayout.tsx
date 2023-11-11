import {
    Card,
    CardBody,
    IconButton,
    List,
    ListItem,
    ListItemPrefix,
    Navbar,
    Tooltip,
    Typography
} from "@material-tailwind/react";
import { MaterialSymbol } from "@/utils/components/index";
import { useCallback, useEffect, useMemo, useState } from "react";
import { logout } from "@/auth/api";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function MainLayout() {
    return (
        <div className="w-screen h-screen p-4 grid gap-4
        grid-cols-[minmax(20rem,_20vw)_auto] grid-rows-[min-content_auto]">
            <MainNavbar />
            <MainSidebar />
            <div className="col-start-2 col-span-1 row-start-2 row-span-1 w-full">
                <Outlet />
            </div>
        </div>
    );
}

function MainNavbar() {
    const [ isConfirming, setIsConfirming ] = useState(false);

    useEffect(() => {
        if (!isConfirming) return;

        const id = setTimeout(() => setIsConfirming(false), 4000);
        return () => clearTimeout(id);
    }, [ isConfirming ]);

    const attemptLogout = useCallback(() => {
        setIsConfirming(prevState => {
            if (prevState) logout();
            return !prevState;
        });
    }, []);

    return (
        <Navbar className="sticky top-0 z-10 h-max max-w-full px-4 py-2
        lg:px-8 lg:py-4 flex flex-row justify-between items-center
        col-start-1 col-span-full row-start-1 row-span-1">
            <Typography color="black" className="font-serif select-none" variant="h5">
                Library Application
            </Typography>
            <Tooltip content="Kijelentkezés" placement="left">
                <IconButton color="red" variant={ isConfirming ? "gradient" : "text" }
                            onClick={ attemptLogout }>
                    <MaterialSymbol name="logout" />
                </IconButton>
            </Tooltip>
        </Navbar>
    );
}

function MainSidebar() {
    const links = useMemo<{
        icon: string
        title: string
        redirect: string
    }[]>(() => {
        return [ {
            icon: "library_books",
            title: "Könyvek",
            redirect: "books"
        }, {
            icon: "groups",
            title: "Tagok",
            redirect: "members"
        }, {
            icon: "loyalty",
            title: "Könyvkiadás",
            redirect: "borrowing"
        }, {
            icon: "inventory",
            title: "Beszerzések",
            redirect: "acquisitions"
        } ];
    }, []);

    return (
        <Card className="shadow-lg bg-white bg-opacity-80 border border-white/80 w-full">
            <CardBody className="px-0 flex flex-col items-stretch justify-start gap-2">
                <Typography className="px-8 mb-4 select-none" color="deep-purple" variant="h5">
                    Navigáció
                </Typography>
                <hr />
                <List>
                    { links.map((value, index) => (
                        <NavButton { ...value } key={ index } />
                    )) }
                </List>
            </CardBody>
        </Card>
    );
}

function NavButton(props: {
    icon: string
    title: string
    redirect: string
}) {
    const { pathname } = useLocation();

    const isActive = useMemo(() => {
        return pathname.includes(props.redirect);
    }, [ pathname, props.redirect ]);

    return (
        <Link to={ props.redirect }
              className={ `px-6 border-l-4
             ${ isActive ? "border-deep-purple-400" : "border-transparent" }` }>
            <ListItem className={ `${ isActive ? "bg-deep-purple-50" : "bg-transparent" }
            gap-3` }>
                <ListItemPrefix className="mr-0">
                    <MaterialSymbol name={ props.icon } className="text-gray-900" />
                </ListItemPrefix>
                <Typography className="font-medium animate-fade-in"
                            variant="small" color="black">
                    { props.title }
                </Typography>
            </ListItem>
        </Link>
    );
}
