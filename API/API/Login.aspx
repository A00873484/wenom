<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Login.aspx.cs" Inherits="API.Login" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Login page</title>
</head>
<body>
    <form id="form2" runat="server">
    <div style="width: 213px">
        <table style="width: 461px">
            <tr>
                <td>Email:</td>
                <td>
                    <asp:TextBox ID="tbEmail" runat="server" ></asp:TextBox>  
                </td>
                <td class="auto-style2">
                    <asp:RequiredFieldValidator ID="rfvEmail" runat="server" ErrorMessage="Cannot be blank" ControlToValidate="tbEmail">Cannot be blank</asp:RequiredFieldValidator>
                </td>
            </tr>
            <tr>
                <td>Password:</td>
                <td>
                    <asp:TextBox ID="tbPassword" runat="server"></asp:TextBox>
                </td>
                <td class="auto-style2">
                    <asp:RequiredFieldValidator ID="rfvPassword" runat="server" ErrorMessage="Cannot be blank" ControlToValidate="tbPassword">Cannot be blank</asp:RequiredFieldValidator>
                </td>
            </tr>
        </table>
    </div>
        <p>
            <asp:Button ID="Loginbtn" runat="server" OnClick="Button1_Click" Text="Log in" />
        </p>
    </form>
</body>
</html>
